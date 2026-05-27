const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/companies (List all companies)
router.get('/', async (req, res) => {
  try {
    const q = req.query.q || '';
    
    let query = db('companies')
      .select('companies.*')
      .count('jobs.id as job_count')
      .leftJoin('jobs', 'companies.id', 'jobs.company_id')
      .groupBy('companies.id')
      .orderBy('job_count', 'desc');

    if (q) {
      query = query.where('companies.name', 'ilike', `%${q}%`);
    }

    const companies = await query;
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// GET /api/companies/:id (Get company details)
router.get('/:id', async (req, res) => {
  try {
    const company = await db('companies').where('id', req.params.id).first();
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

// GET /api/companies/:id/jobs (Get jobs for a specific company)
router.get('/:id/jobs', async (req, res) => {
  try {
    const jobs = await db('jobs')
      .select(
        'id', 'title', 'company_name', 'location', 
        'experience_level', 'salary_range', 'is_active',
        'description', 'skills_desc', 'required_skills'
      )
      .where('company_id', req.params.id)
      .where('is_active', true)
      .orderBy('created_at', 'desc');
    
    res.json({ jobs, total: jobs.length });
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({ error: 'Failed to fetch company jobs' });
  }
});

module.exports = router;
