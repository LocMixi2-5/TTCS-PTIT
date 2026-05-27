const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const db = require('./database');

// Read the mockData.js
const mockDataPath = path.join(__dirname, '../../../frontend/src/data/mockData.js');
let mockDataContent = fs.readFileSync(mockDataPath, 'utf-8');
// Convert ESM export to simple const declarations
mockDataContent = mockDataContent.replace(/export const/g, 'exports.');
const m = { exports: {} };
const fn = new Function('exports', mockDataContent);
fn(m.exports);

const { companies, jobs } = m.exports;

async function seedMockData() {
  console.log('🔄 Đang reset dữ liệu jobs...');
  await db('recommendations').del();
  await db('bookmarks').del();
  await db('user_tracking_events').del();
  await db('jobs').del();
  await db('companies').del();

  console.log('🔄 Đang seed 14 companies...');
  const companyMap = {};
  for (const c of companies) {
    const [inserted] = await db('companies').insert({
      name: c.name,
      logo_url: c.logo,
      description: c.fullDescription || c.description,
      website: 'https://' + c.logo.split('/').pop()
    }).returning('*');
    companyMap[c.id] = inserted.id;
  }

  console.log('🔄 Đang seed 38 jobs...');
  const jobsToInsert = jobs.map(j => {
    const comp = companies.find(c => c.id === j.companyId);
    return {
      title: j.title,
      description: j.description,
      skills_desc: 'Required: ' + j.tags.join(', '),
      required_skills: '{' + j.tags.join(',') + '}',
      experience_level: j.experience_level,
      location: j.location,
      company_name: comp.name,
      salary_range: j.salary,
      job_url: 'https://example.com/job/' + j.id,
      is_active: true,
      indexed_in_pinecone: false,
      cleaned_text: (j.title + ' ' + j.description + ' ' + j.tags.join(' ')).toLowerCase().replace(/[^a-z0-9\s#+\-.]/g, ' ').replace(/\s+/g, ' ').trim(),
      company_id: companyMap[j.companyId]
    };
  });

  await db('jobs').insert(jobsToInsert);
  console.log('✅ Xong! Vui lòng restart AI worker.');
  process.exit(0);
}

seedMockData().catch(err => { console.error(err); process.exit(1); });
