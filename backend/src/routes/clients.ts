import { Router, Request, Response } from 'express';
import { query } from '../db';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { idempotency } from '../middleware/idempotency';

const router = Router();
router.use(authenticate);

// GET /api/clients
router.get('/', async (req: AuthRequest, res: Response) => {
  const { search, page = '1', limit = '20' } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  let whereClause = '';
  const params: any[] = [];

  if (search) {
    whereClause = 'WHERE full_name ILIKE $1 OR email ILIKE $1 OR company_name ILIKE $1 OR phone ILIKE $1';
    params.push(`%${search}%`);
  }

  const countResult = await query(`SELECT COUNT(*) FROM clients ${whereClause}`, params);
  const total = parseInt(countResult.rows[0].count);

  params.push(parseInt(limit as string));
  params.push(offset);
  const limitParam = params.length - 1;

  const { rows } = await query(
    `SELECT c.*,
      COUNT(s.id) AS total_shipments,
      COUNT(s.id) FILTER (WHERE s.status = 'in_transit') AS active_shipments
     FROM clients c
     LEFT JOIN shipments s ON c.id = s.client_id
     ${whereClause}
     GROUP BY c.id
     ORDER BY c.created_at DESC
     LIMIT $${limitParam} OFFSET $${limitParam + 1}`,
    params
  );

  res.json({
    success: true,
    data: rows,
    pagination: { total, page: parseInt(page as string), limit: parseInt(limit as string), pages: Math.ceil(total / parseInt(limit as string)) },
  });
});

// GET /api/clients/:id
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const { rows } = await query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
  if (!rows[0]) { res.status(404).json({ success: false, error: 'Client not found' }); return; }

  const { rows: shipments } = await query(
    'SELECT tracking_number, status, transport_mode, origin, destination, created_at FROM shipments WHERE client_id = $1 ORDER BY created_at DESC',
    [req.params.id]
  );

  res.json({ success: true, data: { ...rows[0], shipments } });
});

// POST /api/clients
router.post('/', idempotency, async (req: AuthRequest, res: Response) => {
  const { full_name, email, phone, country, company_name, notes } = req.body;
  if (!full_name) { res.status(400).json({ success: false, error: 'full_name is required' }); return; }

  const { rows } = await query(
    'INSERT INTO clients (full_name, email, phone, country, company_name, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [full_name, email || null, phone || null, country || null, company_name || null, notes || null]
  );
  res.status(201).json({ success: true, data: rows[0] });
});

// PATCH /api/clients/:id
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const allowed = ['full_name', 'email', 'phone', 'country', 'company_name', 'notes'];
  const updates: string[] = [];
  const values: any[] = [];
  let count = 1;
  for (const field of allowed) {
    if (field in req.body) { updates.push(`${field} = $${count}`); values.push(req.body[field]); count++; }
  }
  if (!updates.length) { res.status(400).json({ success: false, error: 'No valid fields' }); return; }
  updates.push('updated_at = NOW()');
  values.push(req.params.id);
  const { rows } = await query(`UPDATE clients SET ${updates.join(', ')} WHERE id = $${count} RETURNING *`, values);
  if (!rows[0]) { res.status(404).json({ success: false, error: 'Client not found' }); return; }
  res.json({ success: true, data: rows[0] });
});

// DELETE /api/clients/:id
router.delete('/:id', requireRole(['super_admin']), async (req: AuthRequest, res: Response) => {
  await query('DELETE FROM clients WHERE id = $1', [req.params.id]);
  res.json({ success: true, message: 'Client deleted' });
});

export default router;
