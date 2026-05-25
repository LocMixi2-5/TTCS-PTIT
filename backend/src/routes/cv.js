// ═══════════════════════════════════════════════════
// CV Routes — Upload and manage CV files
//
// POST /api/cv/upload     — Upload CV (PDF)
// GET  /api/cv/list       — List user's CVs
// GET  /api/cv/:id        — Get CV details
// GET  /api/cv/:id/status — Check processing status
// DELETE /api/cv/:id      — Delete a CV
// ═══════════════════════════════════════════════════
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// ─── Multer Configuration ────────────────────────
// Multer handles multipart/form-data (file uploads)
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create user-specific upload directory
    const userDir = path.join(uploadDir, `user_${req.user.id}`);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_originalname.pdf
    // Fix multer latin1 encoding issue with utf8 characters
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// All CV routes require authentication
router.use(authenticateToken);

// ─── POST /api/cv/upload ─────────────────────────
router.post('/upload', upload.single('cv_file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please attach a PDF.' });
    }

    // 1. Save CV record in database
    const [cv] = await db('cvs')
      .insert({
        user_id: req.user.id,
        filename: req.file.originalname,
        file_path: req.file.path,
        processing_status: 'pending',
      })
      .returning('*');

    // 2. Send file to AI Worker for processing (async)
    //    In production, use BullMQ job queue via Redis
    //    For now, call FastAPI directly in background
    processCV(cv.id, cv.file_path).catch((err) => {
      console.error(`CV processing failed for cv_id=${cv.id}:`, err.message);
    });

    // 3. Return immediately (202 Accepted = processing started)
    res.status(202).json({
      message: 'CV uploaded successfully. Processing started.',
      cv: {
        id: cv.id,
        filename: cv.filename,
        processing_status: cv.processing_status,
        created_at: cv.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── Background CV Processing ────────────────────
async function processCV(cvId, filePath) {
  try {
    // Update status to 'processing'
    await db('cvs').where({ id: cvId }).update({ processing_status: 'processing' });

    // Call FastAPI AI Worker
    const aiWorkerUrl = process.env.AI_WORKER_URL || 'http://localhost:8000';

    // Read file and send to AI worker
    const formData = new (require('form-data'))();
    // Override filename to avoid non-ASCII header issues in FastAPI
    formData.append('file', fs.createReadStream(filePath), { filename: 'cv.pdf' });
    formData.append('top_k', '20');
    formData.append('min_score', '0.3');

    const response = await axios.post(`${aiWorkerUrl}/api/ai/match`, formData, {
      headers: formData.getHeaders(),
      timeout: 120000, // 2 min timeout for AI processing
    });

    const aiResult = response.data;

    // Save extracted data back to CV
    await db('cvs').where({ id: cvId }).update({
      raw_text: aiResult.raw_text || null,
      extracted_skills: aiResult.cv_skills_extracted || [],
      processing_status: 'completed',
      updated_at: new Date(),
    });

    // Save recommendations
    if (aiResult.results && aiResult.results.length > 0) {
      const recommendations = aiResult.results.map((r, index) => ({
        cv_id: cvId,
        job_id: r.job_id,
        match_score: r.match_score,
        matched_skills: r.matched_skills || [],
        rank_position: index + 1,
      }));

      // Upsert recommendations (replace old results for this CV)
      await db('recommendations').where({ cv_id: cvId }).del();
      await db('recommendations').insert(recommendations);
    }

    console.log(`✅ CV ${cvId} processed: ${aiResult.total_matches} matches found`);
  } catch (err) {
    // Mark CV as failed
    await db('cvs').where({ id: cvId }).update({
      processing_status: 'failed',
      error_message: err.message,
      updated_at: new Date(),
    });
    throw err;
  }
}

// ─── GET /api/cv/list ────────────────────────────
router.get('/list', async (req, res, next) => {
  try {
    const cvs = await db('cvs')
      .where({ user_id: req.user.id })
      .select('id', 'filename', 'processing_status', 'extracted_skills', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc');

    res.json({ cvs });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/cv/:id ─────────────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const cv = await db('cvs')
      .where({ id: req.params.id, user_id: req.user.id })
      .first();

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    res.json({ cv });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/cv/:id/status ──────────────────────
// Used for polling the processing status
router.get('/:id/status', async (req, res, next) => {
  try {
    const cv = await db('cvs')
      .where({ id: req.params.id, user_id: req.user.id })
      .select('id', 'processing_status', 'error_message', 'updated_at')
      .first();

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    res.json({
      id: cv.id,
      status: cv.processing_status,
      error: cv.error_message,
      updated_at: cv.updated_at,
    });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/cv/:id ──────────────────────────
router.delete('/:id', async (req, res, next) => {
  try {
    const cv = await db('cvs')
      .where({ id: req.params.id, user_id: req.user.id })
      .first();

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    // Delete file from disk
    if (fs.existsSync(cv.file_path)) {
      fs.unlinkSync(cv.file_path);
    }

    // Delete from database (cascades to recommendations)
    await db('cvs').where({ id: cv.id }).del();

    res.json({ message: 'CV deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
