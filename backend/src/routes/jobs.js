// ═══════════════════════════════════════════════════
// Jobs Routes — Browse and interact with job postings
//
// GET  /api/jobs/:id          — Get job details
// POST /api/jobs/:id/bookmark — Toggle bookmark
// POST /api/jobs/:id/apply    — Record application
// ═══════════════════════════════════════════════════
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// ─── GET /api/jobs/:id ───────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const job = await db('jobs')
      .where({ id: req.params.id, is_active: true })
      .first();

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if bookmarked by current user
    const bookmark = await db('bookmarks')
      .where({ user_id: req.user.id, job_id: job.id })
      .first();

    res.json({
      job: {
        ...job,
        is_bookmarked: !!bookmark,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/jobs/:id/bookmark ─────────────────
// Toggle bookmark: if exists → remove, if not → add
router.post('/:id/bookmark', async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if already bookmarked
    const existing = await db('bookmarks')
      .where({ user_id: userId, job_id: jobId })
      .first();

    if (existing) {
      // Remove bookmark
      await db('bookmarks').where({ id: existing.id }).del();
      res.json({ is_bookmarked: false, message: 'Bookmark removed' });
    } else {
      // Add bookmark
      await db('bookmarks').insert({ user_id: userId, job_id: jobId });
      res.json({ is_bookmarked: true, message: 'Job bookmarked' });
    }
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/jobs/:id/apply ────────────────────
// Records that user clicked "Apply" (for tracking)
router.post('/:id/apply', async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id);

    const job = await db('jobs').where({ id: jobId }).first();
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Record tracking event
    await db('user_tracking_events').insert({
      user_id: req.user.id,
      session_id: req.body.session_id || '00000000-0000-0000-0000-000000000000',
      event_type: 'APPLY',
      job_id: jobId,
      payload: JSON.stringify({ applied_via: req.body.applied_via || 'internal' }),
      client_timestamp: new Date(),
    });

    res.json({
      message: 'Application recorded',
      job_url: job.job_url,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
