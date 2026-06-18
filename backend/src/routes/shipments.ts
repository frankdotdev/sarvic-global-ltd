import { Router, Request, Response } from 'express';
import { query, getClient } from '../db';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';
import { idempotency } from '../middleware/idempotency';
import { generateTrackingNumber } from '../utils/trackingNumber';
import { notifyStatusUpdate } from '../services/notificationService';
import { ShipmentStatus } from '../utils/types';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/shipments — list with filters
router.get('/', async (req: AuthRequest, res: Response) => {
  const { status, mode, search, page = '1', limit = '20' } = req.query;
  const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

  let whereClause = 'WHERE 1=1';
  const params: any[] = [];
  let paramCount = 0;

  if (status) {
    paramCount++;
    whereClause += ` AND s.status = $${paramCount}`;
    params.push(status);
  }

  if (mode) {
    paramCount++;
    whereClause += ` AND s.transport_mode = $${paramCount}`;
    params.push(mode);
  }

  if (search) {
    paramCount++;
    whereClause += ` AND (s.tracking_number ILIKE $${paramCount} OR c.full_name ILIKE $${paramCount} OR c.company_name ILIKE $${paramCount})`;
    params.push(`%${search}%`);
  }

  const countQuery = await query(
    `SELECT COUNT(*) FROM shipments s LEFT JOIN clients c ON s.client_id = c.id ${whereClause}`,
    params
  );
  const total = parseInt(countQuery.rows[0].count);

  params.push(parseInt(limit as string));
  params.push(offset);

  const { rows } = await query(
    `SELECT
      s.*,
      c.full_name AS client_name,
      c.email AS client_email,
      c.phone AS client_phone,
      c.company_name AS client_company
    FROM shipments s
    LEFT JOIN clients c ON s.client_id = c.id
    ${whereClause}
    ORDER BY s.created_at DESC
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
    params
  );

  res.json({
    success: true,
    data: rows,
    pagination: {
      total,
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      pages: Math.ceil(total / parseInt(limit as string)),
    },
  });
});

// GET /api/shipments/stats — dashboard statistics
router.get('/stats', async (req: AuthRequest, res: Response) => {
  const { rows } = await query(`
    SELECT
      COUNT(*) FILTER (WHERE status != 'cancelled') AS total_shipments,
      COUNT(*) FILTER (WHERE status = 'in_transit') AS in_transit,
      COUNT(*) FILTER (WHERE status = 'delivered') AS delivered,
      COUNT(*) FILTER (WHERE status IN ('received', 'loading')) AS pending,
      COUNT(*) FILTER (WHERE status = 'on_hold') AS on_hold,
      COUNT(*) FILTER (WHERE status = 'customs_clearing') AS customs_clearing
    FROM shipments
  `);

  const { rows: clientRows } = await query('SELECT COUNT(*) AS total_clients FROM clients');

  res.json({
    success: true,
    data: {
      ...rows[0],
      total_clients: clientRows[0].total_clients,
    },
  });
});

// GET /api/shipments/:id — single shipment detail
router.get('/:id', async (req: AuthRequest, res: Response) => {
  const { rows } = await query(
    `SELECT
      s.*,
      c.full_name AS client_name,
      c.email AS client_email,
      c.phone AS client_phone,
      c.company_name AS client_company,
      au.full_name AS created_by_name
    FROM shipments s
    LEFT JOIN clients c ON s.client_id = c.id
    LEFT JOIN admin_users au ON s.created_by = au.id
    WHERE s.id = $1 OR s.tracking_number = $1`,
    [req.params.id]
  );

  if (!rows[0]) {
    res.status(404).json({ success: false, error: 'Shipment not found' });
    return;
  }

  // Fetch events
  const { rows: events } = await query(
    `SELECT se.*, au.full_name AS created_by_name
     FROM shipment_events se
     LEFT JOIN admin_users au ON se.created_by = au.id
     WHERE se.shipment_id = $1
     ORDER BY se.occurred_at DESC`,
    [rows[0].id]
  );

  // Fetch documents
  const { rows: documents } = await query(
    'SELECT * FROM shipment_documents WHERE shipment_id = $1 ORDER BY created_at DESC',
    [rows[0].id]
  );

  res.json({
    success: true,
    data: { ...rows[0], events, documents },
  });
});

// POST /api/shipments — create new shipment
router.post('/', idempotency, async (req: AuthRequest, res: Response) => {
  const {
    client_id, cargo_type, description, weight_kg, volume_cbm, quantity, unit,
    origin, destination, transport_mode, expected_delivery, declared_value,
    currency, freight_cost, special_instructions,
    // Client details (if new client)
    client_name, client_email, client_phone, client_company,
  } = req.body;

  if (!cargo_type || !origin || !destination || !transport_mode) {
    res.status(400).json({
      success: false,
      error: 'Required fields: cargo_type, origin, destination, transport_mode',
    });
    return;
  }

  const dbClient = await getClient();

  try {
    await dbClient.query('BEGIN');

    let resolvedClientId = client_id;

    // Create client if details provided but no client_id
    if (!client_id && client_name) {
      const { rows: newClient } = await dbClient.query(
        `INSERT INTO clients (full_name, email, phone, company_name)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [client_name, client_email || null, client_phone || null, client_company || null]
      );
      resolvedClientId = newClient[0].id;
    }

    const trackingNumber = await generateTrackingNumber();

    const { rows } = await dbClient.query(
      `INSERT INTO shipments (
        tracking_number, client_id, cargo_type, description, weight_kg, volume_cbm,
        quantity, unit, origin, destination, transport_mode, status,
        expected_delivery, declared_value, currency, freight_cost,
        special_instructions, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'received', $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        trackingNumber, resolvedClientId || null, cargo_type, description || null,
        weight_kg || null, volume_cbm || null, quantity || null, unit || null,
        origin, destination, transport_mode, expected_delivery || null,
        declared_value || null, currency || 'USD', freight_cost || null,
        special_instructions || null, req.admin!.id,
      ]
    );

    // Create initial event
    await dbClient.query(
      `INSERT INTO shipment_events (shipment_id, event_type, location, description, created_by, is_system_generated)
       VALUES ($1, 'created', $2, 'Shipment created and tracking number assigned.', $3, true)`,
      [rows[0].id, origin, req.admin!.id]
    );

    await dbClient.query('COMMIT');

    // Send booking confirmation email
    if (client_email) {
      notifyStatusUpdate({
        trackingNumber,
        newStatus: 'received',
        clientEmail: client_email,
        clientPhone: client_phone || null,
        shipmentId: rows[0].id,
        clientId: resolvedClientId,
        currentLocation: origin,
      }).catch(console.error);
    }

    res.status(201).json({
      success: true,
      data: rows[0],
      message: `Shipment created. Tracking number: ${trackingNumber}`,
    });
  } catch (err) {
    await dbClient.query('ROLLBACK');
    throw err;
  } finally {
    dbClient.release();
  }
});

// PATCH /api/shipments/:id/status — update status
router.patch('/:id/status', idempotency, async (req: AuthRequest, res: Response) => {
  const { status, current_location, use_manual_location, note } = req.body;

  const validStatuses: ShipmentStatus[] = [
    'received', 'loading', 'in_transit', 'customs_clearing',
    'ready_for_pickup', 'out_for_delivery', 'delivered', 'on_hold', 'cancelled',
  ];

  if (!status || !validStatuses.includes(status)) {
    res.status(400).json({ success: false, error: 'Valid status is required' });
    return;
  }

  const dbClient = await getClient();

  try {
    await dbClient.query('BEGIN');

    // Get current shipment + client info
    const { rows: existing } = await dbClient.query(
      `SELECT s.*, c.email AS client_email, c.phone AS client_phone, c.id AS client_id_ref
       FROM shipments s
       LEFT JOIN clients c ON s.client_id = c.id
       WHERE s.id = $1 OR s.tracking_number = $1`,
      [req.params.id]
    );

    if (!existing[0]) {
      res.status(404).json({ success: false, error: 'Shipment not found' });
      await dbClient.query('ROLLBACK');
      return;
    }

    const shipment = existing[0];

    // Build update
    const updateFields: string[] = ['status = $1', 'updated_at = NOW()'];
    const updateParams: any[] = [status];
    let paramCount = 1;

    if (current_location !== undefined) {
      paramCount++;
      updateFields.push(`current_location = $${paramCount}`);
      updateParams.push(current_location);
    }

    if (use_manual_location !== undefined) {
      paramCount++;
      updateFields.push(`use_manual_location = $${paramCount}`);
      updateParams.push(use_manual_location);
    }

    if (current_location !== undefined && use_manual_location) {
      paramCount++;
      updateFields.push(`current_location_manual = $${paramCount}`);
      updateParams.push(current_location);
    }

    if (status === 'delivered') {
      updateFields.push('actual_delivery = NOW()');
    }

    paramCount++;
    updateParams.push(shipment.id);

    const { rows: updated } = await dbClient.query(
      `UPDATE shipments SET ${updateFields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      updateParams
    );

    // Create event log
    const eventDesc = note
      ? note
      : `Status updated to "${status.replace(/_/g, ' ')}"${current_location ? `. Location: ${current_location}` : ''}.`;

    await dbClient.query(
      `INSERT INTO shipment_events (shipment_id, event_type, location, description, created_by, is_system_generated)
       VALUES ($1, 'status_change', $2, $3, $4, false)`,
      [shipment.id, current_location || null, eventDesc, req.admin!.id]
    );

    await dbClient.query('COMMIT');

    // Send notification
    notifyStatusUpdate({
      trackingNumber: shipment.tracking_number,
      newStatus: status,
      clientEmail: shipment.client_email,
      clientPhone: shipment.client_phone,
      shipmentId: shipment.id,
      clientId: shipment.client_id_ref,
      currentLocation: current_location || shipment.current_location,
    }).catch(console.error);

    res.json({
      success: true,
      data: updated[0],
      message: 'Shipment status updated successfully',
    });
  } catch (err) {
    await dbClient.query('ROLLBACK');
    throw err;
  } finally {
    dbClient.release();
  }
});

// PATCH /api/shipments/:id — update general shipment details
router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const allowedFields = [
    'cargo_type', 'description', 'weight_kg', 'volume_cbm', 'quantity', 'unit',
    'origin', 'destination', 'transport_mode', 'expected_delivery', 'declared_value',
    'currency', 'freight_cost', 'special_instructions', 'is_flagged', 'flag_reason',
    'current_location', 'current_location_manual', 'use_manual_location',
  ];

  const updates: string[] = [];
  const values: any[] = [];
  let count = 1;

  for (const field of allowedFields) {
    if (field in req.body) {
      updates.push(`${field} = $${count}`);
      values.push(req.body[field]);
      count++;
    }
  }

  if (updates.length === 0) {
    res.status(400).json({ success: false, error: 'No valid fields to update' });
    return;
  }

  updates.push('updated_at = NOW()');
  values.push(req.params.id);

  const { rows } = await query(
    `UPDATE shipments SET ${updates.join(', ')} WHERE id = $${count} OR tracking_number = $${count} RETURNING *`,
    values
  );

  if (!rows[0]) {
    res.status(404).json({ success: false, error: 'Shipment not found' });
    return;
  }

  res.json({ success: true, data: rows[0] });
});

// POST /api/shipments/:id/events — add manual event
router.post('/:id/events', idempotency, async (req: AuthRequest, res: Response) => {
  const { event_type, location, description, occurred_at } = req.body;

  if (!description) {
    res.status(400).json({ success: false, error: 'Description is required' });
    return;
  }

  // Verify shipment exists
  const { rows: shipment } = await query(
    'SELECT id FROM shipments WHERE id = $1 OR tracking_number = $1',
    [req.params.id]
  );

  if (!shipment[0]) {
    res.status(404).json({ success: false, error: 'Shipment not found' });
    return;
  }

  const { rows } = await query(
    `INSERT INTO shipment_events (shipment_id, event_type, location, description, occurred_at, created_by, is_system_generated)
     VALUES ($1, $2, $3, $4, $5, $6, false)
     RETURNING *`,
    [
      shipment[0].id,
      event_type || 'note',
      location || null,
      description,
      occurred_at || new Date().toISOString(),
      req.admin!.id,
    ]
  );

  res.status(201).json({ success: true, data: rows[0] });
});

// DELETE /api/shipments/:id — soft delete / cancel
router.delete('/:id', requireRole(['super_admin', 'admin']), async (req: AuthRequest, res: Response) => {
  const { rows } = await query(
    `UPDATE shipments SET status = 'cancelled', updated_at = NOW()
     WHERE id = $1 OR tracking_number = $1
     RETURNING tracking_number`,
    [req.params.id]
  );

  if (!rows[0]) {
    res.status(404).json({ success: false, error: 'Shipment not found' });
    return;
  }

  res.json({ success: true, message: `Shipment ${rows[0].tracking_number} cancelled` });
});

export default router;
