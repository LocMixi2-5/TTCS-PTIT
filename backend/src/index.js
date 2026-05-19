// ═══════════════════════════════════════════════════
// Main Express Server
// Job Recommender System — Node.js API Gateway
//
// This server acts as the API Gateway:
// - Handles auth, file uploads, and CRUD operations
// - Forwards AI tasks to the Python FastAPI worker
// - Collects user behavior tracking events
// ═══════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const recommendationsRoutes = require('./routes/recommendations');
const jobsRoutes = require('./routes/jobs');
const trackingRoutes = require('./routes/tracking');
const companiesRoutes = require('./routes/companies');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Global Middleware ───────────────────────────
// helmet: sets security headers (XSS protection, etc.)
app.use(helmet());

// cors: allows frontend (different port) to call this API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (dev format: colored, concise)
app.use(morgan('dev'));

// ─── Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/companies', companiesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'job-recommender-backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─── Error Handling ──────────────────────────────
app.use(notFoundHandler);   // 404 for unmatched routes
app.use(errorHandler);      // Global error handler

// ─── Start Server ────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║  🚀 Job Recommender API Gateway              ║
  ║  Running on: http://localhost:${PORT}            ║
  ║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(30)}║
  ╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
