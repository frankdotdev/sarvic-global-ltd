import { Request, Response, NextFunction } from 'express';
import { query } from '../db';

export const idempotency = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const idempotencyKey = req.headers['idempotency-key'] as string;

  if (!idempotencyKey) {
    next();
    return;
  }

  // Check if we've seen this key before
  const { rows } = await query(
    'SELECT response_status, response_body FROM idempotency_keys WHERE key = $1 AND expires_at > NOW()',
    [idempotencyKey]
  );

  if (rows[0]) {
    // Return cached response
    res.status(rows[0].response_status).json(rows[0].response_body);
    return;
  }

  // Intercept the response to cache it
  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    // Store the response
    query(
      `INSERT INTO idempotency_keys (key, endpoint, response_status, response_body)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (key) DO NOTHING`,
      [idempotencyKey, req.path, res.statusCode, body]
    ).catch(console.error);

    return originalJson(body);
  };

  next();
};
