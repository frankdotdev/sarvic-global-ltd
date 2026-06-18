import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db';
import { authRateLimit } from '../middleware/rateLimit';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const COOKIE_MAX_AGE = 8 * 60 * 60 * 1000; // 8 hours

// POST /api/auth/login
router.post('/login', authRateLimit, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  const { rows } = await query(
    'SELECT id, email, full_name, role, password_hash, is_active FROM admin_users WHERE email = $1',
    [email.toLowerCase().trim()]
  );

  const admin = rows[0];

  if (!admin || !admin.is_active) {
    // Consistent timing to prevent user enumeration
    await bcrypt.compare(password, '$2b$12$invalid.hash.for.timing.purposes.only');
    res.status(401).json({ success: false, error: 'Invalid credentials' });
    return;
  }

  const passwordValid = await bcrypt.compare(password, admin.password_hash);
  if (!passwordValid) {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
    return;
  }

  // Update last login
  await query('UPDATE admin_users SET last_login_at = NOW() WHERE id = $1', [admin.id]);

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
  );

  // Set HTTP-only cookie for web clients
  res.cookie('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });

  res.json({
    success: true,
    data: {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
      },
    },
  });
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token', { path: '/' });
  res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, (req: AuthRequest, res: Response) => {
  res.json({ success: true, data: req.admin });
});

// POST /api/auth/change-password
router.post('/change-password', authenticate, async (req: AuthRequest, res: Response) => {
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    res.status(400).json({ success: false, error: 'Both passwords are required' });
    return;
  }

  if (new_password.length < 8) {
    res.status(400).json({ success: false, error: 'New password must be at least 8 characters' });
    return;
  }

  const { rows } = await query(
    'SELECT password_hash FROM admin_users WHERE id = $1',
    [req.admin!.id]
  );

  const valid = await bcrypt.compare(current_password, rows[0].password_hash);
  if (!valid) {
    res.status(401).json({ success: false, error: 'Current password is incorrect' });
    return;
  }

  const newHash = await bcrypt.hash(new_password, 12);
  await query('UPDATE admin_users SET password_hash = $1 WHERE id = $2', [newHash, req.admin!.id]);

  res.json({ success: true, message: 'Password updated successfully' });
});

export default router;
