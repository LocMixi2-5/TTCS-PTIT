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

// ─── Auto-Cleanup ──────────────────────────────────
// Thời gian sống của tracking (đề xuất) là 2 phút
setInterval(async () => {
  try {
    // Xóa các event mà client_timestamp cũ hơn 2 phút so với hiện tại
    await db('user_tracking_events')
      .whereRaw("client_timestamp < NOW() - INTERVAL '2 minutes'")
      .del();
  } catch (err) {
    console.error('Failed to cleanup tracking events:', err.message);
  }
}, 30000); // Check every 30 seconds

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

// ─── GET /api/tracking/stats ────────────────────
// Returns tracking insights for the current user
// Used by TrackingInsightsPanel to show "what the system learned"
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 1. Event counts by type
    const eventCounts = await db('user_tracking_events')
      .where({ user_id: userId })
      .select('event_type')
      .count('* as count')
      .groupBy('event_type');

    const byType = {};
    let totalEvents = 0;
    eventCounts.forEach(row => {
      byType[row.event_type] = parseInt(row.count);
      totalEvents += parseInt(row.count);
    });

    // 2. Engagement distribution (from DWELL_TIME events)
    const engagementRows = await db('user_tracking_events')
      .where({ user_id: userId, event_type: 'DWELL_TIME' })
      .select(db.raw("payload->>'engagement_level' as engagement"))
      .count('* as count')
      .groupBy(db.raw("payload->>'engagement_level'"));

    const engagement = { GLANCE: 0, SKIM: 0, DEEP_READ: 0 };
    engagementRows.forEach(row => {
      if (engagement[row.engagement] !== undefined) {
        engagement[row.engagement] = parseInt(row.count);
      }
    });

    // 3. Average dwell time
    const dwellAvg = await db('user_tracking_events')
      .where({ user_id: userId, event_type: 'DWELL_TIME' })
      .avg(db.raw("(payload->>'dwell_seconds')::numeric as avg_dwell"));

    const avgDwellSeconds = dwellAvg[0]?.avg_dwell
      ? Math.round(parseFloat(dwellAvg[0].avg_dwell) * 10) / 10
      : 0;

    // 4. Top interacted skills (từ jobs user đã tương tác)
    const topSkills = await db.raw(`
      SELECT skill, COUNT(*) as freq
      FROM user_tracking_events t
      JOIN jobs j ON t.job_id = j.id
      CROSS JOIN LATERAL unnest(j.required_skills) as skill
      WHERE t.user_id = ? AND skill IS NOT NULL
      GROUP BY skill
      ORDER BY freq DESC
      LIMIT 6
    `, [userId]);

    // 5. Top interacted jobs
    const topJobs = await db.raw(`
      SELECT j.id, j.title, j.company_name,
        COUNT(*) as interaction_count,
        SUM(CASE 
          WHEN t.event_type = 'APPLY' THEN 15
          WHEN t.event_type = 'BOOKMARK' THEN 10
          WHEN t.event_type = 'DWELL_TIME' THEN 2
          WHEN t.event_type = 'CLICK' THEN 1
          ELSE 0 
        END) as affinity_score
      FROM user_tracking_events t
      JOIN jobs j ON t.job_id = j.id
      WHERE t.user_id = ?
      GROUP BY j.id, j.title, j.company_name
      ORDER BY affinity_score DESC
      LIMIT 5
    `, [userId]);

    // 6. TTL info — khi nào data sẽ hết hạn
    const oldestEvent = await db('user_tracking_events')
      .where({ user_id: userId })
      .orderBy('client_timestamp', 'asc')
      .select('client_timestamp')
      .first();

    const newestEvent = await db('user_tracking_events')
      .where({ user_id: userId })
      .orderBy('client_timestamp', 'desc')
      .select('client_timestamp')
      .first();

    res.json({
      user_id: userId,
      total_events: totalEvents,
      events_by_type: byType,
      engagement_distribution: engagement,
      avg_dwell_seconds: avgDwellSeconds,
      top_skills: topSkills.rows.map(r => ({ skill: r.skill, frequency: parseInt(r.freq) })),
      top_interacted_jobs: topJobs.rows.map(r => ({
        id: r.id,
        title: r.title,
        company_name: r.company_name,
        interactions: parseInt(r.interaction_count),
        affinity_score: parseInt(r.affinity_score),
      })),
      ttl_info: {
        ttl_minutes: 2,
        oldest_event: oldestEvent?.client_timestamp || null,
        newest_event: newestEvent?.client_timestamp || null,
        message: 'Tracking data sống 2 phút — giống dopamine, tương tác mới thì đề xuất hưng phấn, hết thời gian thì reset.',
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

