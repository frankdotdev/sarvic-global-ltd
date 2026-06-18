import { query } from '../db';

/**
 * Generates a unique tracking number in format SVG-DDMM-XXXX
 * e.g., SVG-2606-8941
 */
export async function generateTrackingNumber(): Promise<string> {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const datePrefix = `${day}${month}`;

  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const random = Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = `SVG-${datePrefix}-${random}`;

    // Check uniqueness
    const { rows } = await query(
      'SELECT id FROM shipments WHERE tracking_number = $1',
      [trackingNumber]
    );

    if (rows.length === 0) {
      return trackingNumber;
    }

    attempts++;
  }

  // Fallback: use timestamp-based suffix
  const timestamp = Date.now().toString().slice(-4);
  return `SVG-${datePrefix}-${timestamp}`;
}

/**
 * Validates tracking number format
 */
export function isValidTrackingNumber(trackingNumber: string): boolean {
  return /^SVG-\d{4}-\d{4}$/.test(trackingNumber.toUpperCase());
}
