// ═══════════════════════════════════════════════════
// JWT Authentication Middleware
// Verifies token and attaches user info to req.user
// ═══════════════════════════════════════════════════
const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate JWT tokens
 * 
 * How it works:
 * 1. Extract token from "Authorization: Bearer <token>" header
 * 2. Verify the token signature using JWT_SECRET
 * 3. Decode the payload (contains user id, email)
 * 4. Attach decoded user info to req.user
 * 5. If invalid/expired → return 401
 * 
 * Usage in routes:
 *   router.get('/protected', authenticateToken, (req, res) => {
 *     console.log(req.user.id); // User ID from token
 *   });
 */
function authenticateToken(req, res, next) {
  // Step 1: Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      error: 'Access denied',
      message: 'No authentication token provided. Please login first.',
    });
  }

  try {
    // Step 2 & 3: Verify and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Step 4: Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please login again.',
      });
    }
    return res.status(403).json({
      error: 'Invalid token',
      message: 'The provided token is invalid.',
    });
  }
}

/**
 * Optional auth middleware — doesn't block if no token,
 * but attaches user info if a valid token exists.
 * Useful for public routes that behave differently for logged-in users.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, email: decoded.email };
    } catch (err) {
      // Token invalid — that's okay for optional auth
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
}

module.exports = { authenticateToken, optionalAuth };
