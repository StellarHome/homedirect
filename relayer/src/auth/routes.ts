import { Router, Request, Response } from 'express';
import { hashPassword, comparePassword, generateToken } from './utils';
import { query } from '../database/connection';

const router = Router();

/**
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { stellar_public_key, email, phone, first_name, last_name, role, password } = req.body;

    // Validate required fields
    if (!stellar_public_key || !role || !password) {
      res.status(400).json({ error: 'Missing required fields: stellar_public_key, role, password' });
      return;
    }

    // Validate role
    if (!['landlord', 'tenant', 'admin'].includes(role)) {
      res.status(400).json({ error: 'Invalid role. Must be landlord, tenant, or admin' });
      return;
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE stellar_public_key = $1 OR email = $2',
      [stellar_public_key, email || null]
    );

    if (existingUser.rows.length > 0) {
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert user
    const result = await query(
      `INSERT INTO users (stellar_public_key, email, phone, first_name, last_name, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, stellar_public_key, email, phone, first_name, last_name, role, kyc_verified`,
      [stellar_public_key, email || null, phone || null, first_name || null, last_name || null, role, hashedPassword]
    );

    const user = result.rows[0];

    // Generate token
    const token = generateToken({
      userId: user.id,
      stellarPublicKey: user.stellar_public_key,
      role: user.role,
    });

    res.status(201).json({
      user: {
        id: user.id,
        stellar_public_key: user.stellar_public_key,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        kyc_verified: user.kyc_verified,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * Login user
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { stellar_public_key, password } = req.body;

    // Validate required fields
    if (!stellar_public_key || !password) {
      res.status(400).json({ error: 'Missing required fields: stellar_public_key, password' });
      return;
    }

    // Find user
    const result = await query(
      'SELECT * FROM users WHERE stellar_public_key = $1',
      [stellar_public_key]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    // Check if user has password (wallet-only users might not)
    if (!user.password_hash) {
      res.status(401).json({ error: 'Please register with a password first' });
      return;
    }

    // Verify password
    const isValid = await comparePassword(password, user.password_hash);

    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      stellarPublicKey: user.stellar_public_key,
      role: user.role,
    });

    res.json({
      user: {
        id: user.id,
        stellar_public_key: user.stellar_public_key,
        email: user.email,
        phone: user.phone,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        kyc_verified: user.kyc_verified,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * Get current user profile
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // For now, we'll just return a simple response
    // In a real implementation, we would verify the token and fetch user data
    res.json({ message: 'Profile endpoint - implement token verification' });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * Logout (client-side only - token invalidation would require Redis/blacklist)
 */
router.post('/logout', (_req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully' });
});

export default router;
