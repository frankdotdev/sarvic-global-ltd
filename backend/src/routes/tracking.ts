import { Router, Request, Response } from 'express';
import { query } from '../db';
import { trackingRateLimit } from '../middleware/rateLimit';
import { isValidTrackingNumber } from '../utils/trackingNumber';

const router = Router();

// GET /api/tracking/:trackingNumber
router.get('/:trackingNumber', trackingRateLimit, async (req: Request, res: Response) => {
  const trackingNumber = req.params.trackingNumber?.toUpperCase().trim();

  if (!trackingNumber || !isValidTrackingNumber(trackingNumber)) {
    res.status(400).json({
      success: false,
      error: 'Invalid tracking number format. Expected format: SVG-DDMM-XXXX',
    });
    return;
  }

  // Fetch shipment with client info (limited fields for public)
  const { rows: shipmentRows } = await query(
    `SELECT
      s.tracking_number,
      s.status,
      s.transport_mode,
      s.origin,
      s.destination,
      CASE WHEN s.use_manual_location THEN s.current_location_manual ELSE s.current_location END AS current_location,
      s.expected_delivery,
      s.actual_delivery,
      s.cargo_type,
      s.description,
      s.created_at,
      s.updated_at,
      c.full_name AS client_name
    FROM shipments s
    LEFT JOIN clients c ON s.client_id = c.id
    WHERE s.tracking_number = $1 AND s.status != 'cancelled'`,
    [trackingNumber]
  );

  if (!shipmentRows[0]) {
    res.status(404).json({
      success: false,
      error: 'Tracking number not found. Please check and try again.',
    });
    return;
  }

  const shipment = shipmentRows[0];

  // Fetch events (timeline)
  const { rows: events } = await query(
    `SELECT event_type, location, description, occurred_at
     FROM shipment_events
     WHERE shipment_id = (SELECT id FROM shipments WHERE tracking_number = $1)
     ORDER BY occurred_at DESC`,
    [trackingNumber]
  );

  // Fetch public documents (no sensitive files)
  const { rows: documents } = await query(
    `SELECT document_type, file_name, file_url
     FROM shipment_documents
     WHERE shipment_id = (SELECT id FROM shipments WHERE tracking_number = $1)
     AND document_type IN ('invoice', 'packing_list', 'bill_of_lading', 'airway_bill', 'certificate_of_origin')`,
    [trackingNumber]
  );

  res.json({
    success: true,
    data: {
      ...shipment,
      events,
      documents,
    },
  });
});

export default router;
