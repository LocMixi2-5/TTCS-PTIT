// ═══════════════════════════════════════════════════
// Recommendations Routes
//
// GET /api/recommendations/:cvId — Get AI recommendations for a CV
// ═══════════════════════════════════════════════════
const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

// ─── GET /api/recommendations/:cvId ──────────────
router.get('/:cvId', async (req, res, next) => {
  try {
    const { cvId } = req.params;
    const { min_score, location, experience_level } = req.query;

    // 1. Verify CV belongs to user
    const cv = await db('cvs')
      .where({ id: cvId, user_id: req.user.id })
      .first();

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    if (cv.processing_status !== 'completed') {
      return res.status(400).json({
        error: 'CV not ready',
        status: cv.processing_status,
        message: cv.processing_status === 'processing'
          ? 'CV is still being processed. Please try again shortly.'
          : 'CV processing failed. Please re-upload.',
      });
    }

    // 2. Build query for recommendations + job details with implicit feedback
    let query = db.with('job_popularity', db.raw(`
      SELECT job_id, COUNT(*) as pop_score 
      FROM user_tracking_events 
      GROUP BY job_id
    `)).with('user_affinity', db.raw(`
      SELECT job_id, 
        SUM(CASE 
          WHEN event_type = 'APPLY' THEN 15
          WHEN event_type = 'BOOKMARK' THEN 10
          WHEN event_type = 'DWELL_TIME' THEN 2
          WHEN event_type = 'CLICK' THEN 1
          ELSE 0 
        END) as affinity_score
      FROM user_tracking_events
      WHERE user_id = ?
      GROUP BY job_id
    `, [req.user.id]))
      .from('recommendations as r')
      .join('jobs as j', 'r.job_id', 'j.id')
      .leftJoin('job_popularity as jp', 'j.id', 'jp.job_id')
      .leftJoin('user_affinity as ua', 'j.id', 'ua.job_id')
      .where('r.cv_id', cvId)
      .select(
        'r.id as recommendation_id',
        'r.match_score',
        'r.matched_skills',
        'r.rank_position',
        'j.id as job_id',
        'j.title',
        'j.description',
        'j.skills_desc',
        'j.required_skills',
        'j.experience_level',
        'j.location',
        'j.company_name',
        'j.salary_range',
        'j.job_url',
        'jp.pop_score',
        'ua.affinity_score'
      )
      .orderByRaw(`
        (COALESCE(r.match_score, 0) * 0.7) + 
        (LEAST(COALESCE(jp.pop_score, 0), 50) * 0.1) + 
        (LEAST(COALESCE(ua.affinity_score, 0), 100) * 0.2) DESC NULLS LAST,
        r.rank_position ASC
      `);
    // 3. Apply optional filters
    if (min_score) {
      query = query.where('r.match_score', '>=', parseFloat(min_score));
    }
    if (location) {
      query = query.whereILike('j.location', `%${location}%`);
    }
    if (experience_level) {
      query = query.where('j.experience_level', experience_level);
    }

    const recommendations = await query;

    // 4. Check bookmark status for each job
    const bookmarks = await db('bookmarks')
      .where({ user_id: req.user.id })
      .whereIn('job_id', recommendations.map(r => r.job_id))
      .select('job_id');

    const bookmarkedJobIds = new Set(bookmarks.map(b => b.job_id));

    // 5. Format response
    const results = recommendations.map((r, idx) => ({
      recommendation_id: r.recommendation_id,
      rank: idx + 1, // Recalculate rank after sorting
      match_score: parseFloat(r.match_score),
      matched_skills: r.matched_skills || [],
      is_bookmarked: bookmarkedJobIds.has(r.job_id),
      pop_score: parseInt(r.pop_score || 0),
      affinity_score: parseFloat(r.affinity_score || 0),
      job: {
        id: r.job_id,
        title: r.title,
        description: r.description ? r.description.substring(0, 500) + '...' : '',
        full_description: r.description,
        skills_desc: r.skills_desc,
        required_skills: r.required_skills || [],
        experience_level: r.experience_level,
        location: r.location,
        company_name: r.company_name,
        salary_range: r.salary_range,
        job_url: r.job_url,
      },
    }));

    res.json({
      cv_id: parseInt(cvId),
      cv_skills: cv.extracted_skills || [],
      total_results: results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
