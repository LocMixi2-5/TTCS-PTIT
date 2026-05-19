// ═══════════════════════════════════════════════════
// Auth Routes — Registration & Login
//
// POST /api/auth/register — Create a new account
// POST /api/auth/login    — Login and receive JWT
// GET  /api/auth/me       — Get current user info
//
// Flow:
// 1. User registers with email + password
// 2. Password is hashed with bcrypt before storing
// 3. On login, compare password hash
// 4. If valid, sign a JWT token containing {id, email}
// 5. Client stores token and sends in headers for auth
// ═══════════════════════════════════════════════════
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ─── Helper: Generate JWT ────────────────────────
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ─── POST /api/auth/register ─────────────────────
router.post(
  '/register',
  [
    // Validation rules using express-validator
    body('email')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name')
      .optional()
      .trim()
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  ],
  async (req, res, next) => {
    try {
      // 1. Check validation results
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, full_name, preferred_language } = req.body;

      // 2. Check if email already exists
      const existingUser = await db('users').where({ email }).first();
      if (existingUser) {
        return res.status(409).json({
          error: 'Email already registered',
          message: 'An account with this email already exists. Please login instead.',
        });
      }

      // 3. Hash password with bcrypt
      //    Salt rounds = 10 → ~10 hashes/sec (good security/speed balance)
      //    bcrypt automatically generates a random salt and embeds it in the hash
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // 4. Insert user into database
      const [newUser] = await db('users')
        .insert({
          email,
          password_hash,
          full_name: full_name || null,
          preferred_language: preferred_language || 'vi',
        })
        .returning(['id', 'email', 'full_name', 'preferred_language', 'created_at']);

      // 5. Generate JWT token
      const token = generateToken(newUser);

      // 6. Return user info + token
      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: newUser.id,
          email: newUser.email,
          full_name: newUser.full_name,
          preferred_language: newUser.preferred_language,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/auth/login ────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res, next) => {
    try {
      // 1. Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // 2. Find user by email
      const user = await db('users').where({ email }).first();
      if (!user) {
        // Don't reveal whether email exists (security best practice)
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect.',
        });
      }

      // 3. Compare password with stored hash
      //    bcrypt.compare extracts the salt from the stored hash
      //    and hashes the input password with that same salt to compare
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect.',
        });
      }

      // 4. Generate JWT token
      const token = generateToken(user);

      // 5. Return user info + token
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          preferred_language: user.preferred_language,
        },
        token,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/auth/me ────────────────────────────
// Protected route — requires valid JWT token
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'email', 'full_name', 'preferred_language', 'created_at')
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Also get CV count for this user
    const cvCount = await db('cvs')
      .where({ user_id: req.user.id })
      .count('id as count')
      .first();

    res.json({
      user: {
        ...user,
        cv_count: parseInt(cvCount.count),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
