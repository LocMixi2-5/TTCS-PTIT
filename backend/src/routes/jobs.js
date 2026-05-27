// ═══════════════════════════════════════════════════
// Jobs Routes — Browse and interact with job postings
//
// GET  /api/jobs/feed         — Job feed with match scores from latest CV
// GET  /api/jobs/:id          — Get job details
// POST /api/jobs/:id/bookmark — Toggle bookmark
// POST /api/jobs/:id/apply    — Record application (tracking only)
// POST /api/jobs/:id/apply-cv — Upload CV & get instant match score
// ═══════════════════════════════════════════════════
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const db = require('../config/database');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/jobs/feed ──────────────────────────
// Public route (optionalAuth): returns active jobs.
// If user is logged in & has a completed CV, includes
// match_score from the most recent CV's recommendations.
// If no CV → match_score is null for all jobs.
router.get('/feed', optionalAuth, async (req, res, next) => {
  try {
    let latestCv = null;

    // If authenticated, find the user's latest completed CV
    if (req.user) {
      latestCv = await db('cvs')
        .where({ user_id: req.user.id, processing_status: 'completed' })
        .orderBy('created_at', 'desc')
        .first();
    }

    // Build jobs query with optional match scores
    let query;

    if (latestCv) {
      // JOIN with recommendations from latest CV
      query = db('jobs as j')
        .leftJoin('recommendations as r', function () {
          this.on('j.id', 'r.job_id').andOn('r.cv_id', db.raw('?', [latestCv.id]));
        })
        .leftJoin('companies as c', 'j.company_id', 'c.id')
        .where('j.is_active', true)
        .select(
          'j.id',
          'j.title',
          'j.description',
          'j.skills_desc',
          'j.required_skills',
          'j.experience_level',
          'j.location',
          'j.company_name',
          'j.salary_range',
          'j.company_id',
          'c.name as company_display_name',
          'c.logo_url',
          'r.match_score',
          'r.matched_skills',
          'r.rank_position',
          'j.created_at'
        )
        .orderByRaw('r.match_score DESC NULLS LAST, j.created_at DESC');
    } else {
      // No CV — return jobs without match scores
      query = db('jobs as j')
        .leftJoin('companies as c', 'j.company_id', 'c.id')
        .where('j.is_active', true)
        .select(
          'j.id',
          'j.title',
          'j.description',
          'j.skills_desc',
          'j.required_skills',
          'j.experience_level',
          'j.location',
          'j.company_name',
          'j.salary_range',
          'j.company_id',
          'c.name as company_display_name',
          'c.logo_url',
          db.raw('NULL as match_score'),
          db.raw('NULL as matched_skills'),
          db.raw('NULL as rank_position')
        )
        .orderBy('j.created_at', 'desc');
    }

    const jobs = await query;

    res.json({
      jobs: jobs.map((j) => ({
        id: j.id,
        title: j.title,
        description: j.description ? j.description.substring(0, 300) : '',
        required_skills: j.required_skills || [],
        experience_level: j.experience_level,
        location: j.location,
        company_name: j.company_display_name || j.company_name,
        salary_range: j.salary_range,
        company_id: j.company_id,
        logo_url: j.logo_url,
        match_score: j.match_score ? parseFloat(j.match_score) : null,
        matched_skills: j.matched_skills || [],
      })),
      total: jobs.length,
      cv_id: latestCv ? latestCv.id : null,
      has_cv: !!latestCv,
    });
  } catch (err) {
    next(err);
  }
});

// All remaining routes require authentication
router.use(authenticateToken);

// ─── Multer for CV upload (temp, not saved to disk) ─
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Chỉ chấp nhận file PDF'), false);
  },
});

// ─── GET /api/jobs/:id ───────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) {
      // Return a mock response for frontend mock jobs (e.g., 'j26')
      return res.json({
        job: {
          id: req.params.id,
          title: 'Việc làm IT (Mock Data)',
          is_bookmarked: false,
        },
      });
    }

    const job = await db('jobs')
      .where({ id: jobId, is_active: true })
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

    if (isNaN(jobId)) {
      return res.json({ is_bookmarked: true, message: 'Mock job bookmarked' });
    }

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

    if (isNaN(jobId)) {
      return res.json({
        message: 'Mock application recorded',
        job_url: '#',
      });
    }

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

// ─── POST /api/jobs/:id/apply-cv ─────────────────
// Upload CV PDF → AI match with specific job → instant score
router.post('/:id/apply-cv', upload.single('cv_file'), async (req, res, next) => {
  try {
    const jobId = parseInt(req.params.id);
    
    if (isNaN(jobId)) {
       return res.json({
        job_id: req.params.id,
        job_title: 'Việc làm IT Nổi bật',
        company_name: 'Tập đoàn Công nghệ',
        match_score: 95,
        cv_skills: ['React', 'NodeJS', 'AI'],
        matched_skills: ['React', 'NodeJS'],
        missing_skills: ['Python'],
        ai_available: true,
        message: 'Mock AI Match thành công!'
      });
    }

    // 1. Get job details (need description + skills for matching)
    const job = await db('jobs')
      .select('id', 'title', 'description', 'skills_desc', 'required_skills', 'company_name', 'experience_level', 'location', 'salary_range', 'company_id')
      .where({ id: jobId, is_active: true })
      .first();

    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (!req.file) return res.status(400).json({ error: 'Vui lòng upload file CV (PDF)' });

    // 2. Build job context text for matching
    const jobText = `${job.title} ${job.description || ''} ${job.skills_desc || ''}`;

    // 3. Forward CV to AI Worker for matching
    const aiWorkerUrl = process.env.AI_WORKER_URL || 'http://localhost:8000';
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'cv.pdf',
      contentType: 'application/pdf',
    });
    formData.append('manual_text', '');
    formData.append('top_k', '1');
    formData.append('min_score', '0.0');
    // Also send job text for direct comparison
    formData.append('job_text', jobText);

    let aiResult;
    try {
      const response = await axios.post(`${aiWorkerUrl}/api/ai/match-job`, formData, {
        headers: formData.getHeaders(),
        timeout: 60000,
      });
      aiResult = response.data;
    } catch (aiErr) {
      // AI worker unavailable — return basic result
      console.warn('[apply-cv] AI worker unreachable:', aiErr.message);
      return res.json({
        job_id: jobId,
        job_title: job.title,
        company_name: job.company_name,
        match_score: null,
        cv_skills: [],
        matched_skills: [],
        missing_skills: job.required_skills || [],
        ai_available: false,
        message: 'AI worker không khả dụng. CV của bạn đã được ghi nhận.',
      });
    }

    // 4. Compute matched/missing skills
    const jobSkills = (job.required_skills || []).map(s => s.toLowerCase());
    const cvSkills = (aiResult.cv_skills_extracted || []).map(s => s.toLowerCase());
    const matchedSkills = jobSkills.filter(s => cvSkills.includes(s));
    const missingSkills = jobSkills.filter(s => !cvSkills.includes(s));

    // 5. Record apply tracking event
    await db('user_tracking_events').insert({
      user_id: req.user.id,
      session_id: req.body.session_id || '00000000-0000-0000-0000-000000000000',
      event_type: 'APPLY',
      job_id: jobId,
      payload: JSON.stringify({ applied_via: 'cv_upload', match_score: aiResult.match_score }),
      client_timestamp: new Date(),
    }).catch(() => {}); // non-blocking

    res.json({
      job_id: jobId,
      job_title: job.title,
      company_name: job.company_name,
      match_score: aiResult.match_score,
      cv_skills: aiResult.cv_skills_extracted || [],
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      ai_available: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
