import { Router, Response } from 'express';
import multer from 'multer';
import { query } from '../db';
import { authenticate, AuthRequest } from '../middleware/auth';
import { uploadDocument, deleteDocument, isStorageConfigured } from '../services/storageService';

const router = Router();
router.use(authenticate);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type. Allowed: PDF, JPEG, PNG, WebP.'));
    }
  },
});

const validDocTypes = [
  'invoice', 'packing_list', 'bill_of_lading', 'airway_bill',
  'customs_declaration', 'certificate_of_origin', 'insurance', 'other',
];

// POST /api/documents/:shipmentId — upload a document for a shipment
router.post('/:shipmentId', upload.single('file'), async (req: AuthRequest, res: Response) => {
  if (!isStorageConfigured()) {
    res.status(503).json({
      success: false,
      error: 'Document storage is not configured yet. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the backend to enable uploads.',
    });
    return;
  }

  if (!req.file) {
    res.status(400).json({ success: false, error: 'No file provided. Attach a file under the "file" field.' });
    return;
  }

  const documentType = req.body.document_type || 'other';
  if (!validDocTypes.includes(documentType)) {
    res.status(400).json({ success: false, error: `Invalid document_type. Must be one of: ${validDocTypes.join(', ')}` });
    return;
  }

  // Resolve shipment by id or tracking number
  const { rows: shipmentRows } = await query(
    'SELECT id FROM shipments WHERE id = $1 OR tracking_number = $1',
    [req.params.shipmentId]
  );

  if (!shipmentRows[0]) {
    res.status(404).json({ success: false, error: 'Shipment not found' });
    return;
  }

  const shipmentId = shipmentRows[0].id;

  try {
    const { url, path } = await uploadDocument({
      buffer: req.file.buffer,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      shipmentId,
    });

    const { rows } = await query(
      `INSERT INTO shipment_documents (shipment_id, document_type, file_name, file_url, file_size, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [shipmentId, documentType, req.file.originalname, url, req.file.size, req.admin!.id]
    );

    res.status(201).json({ success: true, data: { ...rows[0], storage_path: path } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/documents/:documentId — remove a document
router.delete('/:documentId', async (req: AuthRequest, res: Response) => {
  const { rows } = await query(
    'SELECT file_url FROM shipment_documents WHERE id = $1',
    [req.params.documentId]
  );

  if (!rows[0]) {
    res.status(404).json({ success: false, error: 'Document not found' });
    return;
  }

  await query('DELETE FROM shipment_documents WHERE id = $1', [req.params.documentId]);

  // Best-effort storage cleanup — don't fail the request if this errors,
  // since the DB record removal is the source of truth for the UI.
  try {
    const url = new URL(rows[0].file_url);
    const pathParts = url.pathname.split(`/object/public/`);
    if (pathParts[1]) {
      const storagePath = pathParts[1].split('/').slice(1).join('/');
      await deleteDocument(storagePath);
    }
  } catch (err) {
    console.warn('[Documents] Storage cleanup skipped:', err);
  }

  res.json({ success: true, message: 'Document removed.' });
});

export default router;
