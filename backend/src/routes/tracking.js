// ═══════════════════════════════════════════════════
// Tracking Routes — Collect user behavior events
//
// POST /api/tracking/events — Batch insert tracking events
//
// Events tracked:
// - CLICK: User clicks to view job details
// - DWELL_TIME: How long user reads a job posting
// - BOOKMARK: User saves/unsaves a job
// - APPLY: User clicks apply
// - DISMISS: User hides a recommendation
// - SEARCH: User performs a search query
// ═══════════════════════════════════════════════════
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Valid event types (whitelist)
const VALID_EVENT_TYPES = ['CLICK', 'DWELL_TIME', 'BOOKMARK', 'APPLY', 'DISMISS', 'SEARCH'];

// ─── Auto-Cleanup (For Testing) ──────────────────
// Automatically delete tracking events older than 2 minutes
setInterval(async () => {
  try {
    // Xóa các event mà client_timestamp cũ hơn 2 phút so với hiện tại
    await db('user_tracking_events')
      .whereRaw("client_timestamp < NOW() - INTERVAL '2 minutes'")
      .del();
  } catch (err) {
    console.error('Failed to cleanup tracking events:', err.message);
  }
}, 60000); // Check every 60 seconds

// ─── POST /api/tracking/events ───────────────────
// Receives a batch of events from the frontend SDK
router.post('/events', authenticateToken, async (req, res, next) => {
  try {
    const { events } = req.body;
    const userId = req.user.id;

    // Validation
    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'No events provided' });
    }

    if (events.length > 100) {
      return res.status(400).json({ error: 'Too many events in batch (max 100)' });
    }

    // Filter and validate events
    const validEvents = events.filter((e) => {
      return e.event_type && VALID_EVENT_TYPES.includes(e.event_type) && e.session_id;
    });

    if (validEvents.length === 0) {
      return res.status(400).json({ error: 'No valid events in batch' });
    }

    // Batch insert
    const rows = validEvents.map((event) => {
      let jobId = event.payload?.job_id;
      // Xử lý an toàn: Nếu jobId là chuỗi mock data (ví dụ 'j1', 'j2') thì đặt thành null
      // để PostgreSQL không bị lỗi type integer. Payload JSON vẫn giữ nguyên jobId gốc.
      if (jobId && isNaN(Number(jobId))) {
        jobId = null;
      }

      return {
        user_id: userId,
        session_id: event.session_id,
        event_type: event.event_type,
        job_id: jobId,
        payload: JSON.stringify(event.payload || {}),
        client_timestamp: event.timestamp || new Date(),
      };
    });

    await db('user_tracking_events').insert(rows);

    res.status(201).json({
      received: validEvents.length,
      dropped: events.length - validEvents.length,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
