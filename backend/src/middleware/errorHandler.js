// ═══════════════════════════════════════════════════
// Error Handling Middleware
// Centralized error handler for the entire app
// ═══════════════════════════════════════════════════

/**
 * Global error handler middleware
 * 
 * This sits at the END of middleware chain.
 * When any route calls next(error), it lands here.
 * 
 * Pattern:
 *   try { ... } catch(err) { next(err); }
 *   → lands here → sends formatted JSON error response
 */
function errorHandler(err, req, res, next) {
  // Log error for debugging (in production, use proper logger like Winston)
  console.error(`❌ [${new Date().toISOString()}] ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Determine status code
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

/**
 * 404 handler — catches all unmatched routes
 * Must be placed AFTER all route definitions
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
}

module.exports = { errorHandler, notFoundHandler };
