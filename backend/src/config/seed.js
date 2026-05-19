// ═══════════════════════════════════════════════════
// Seed Script — Import LinkedIn jobs data from CSV to PostgreSQL
//
// Usage: npm run seed
//
// This reads the CSV file from data/ directory and inserts
// job records into the PostgreSQL 'jobs' table.
// ═══════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../../../.env') });

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const db = require('./database');

// ─── CSV Parser (lightweight, no external dependency) ───
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// ─── Extract skills from description ───
function extractSkills(text) {
  if (!text) return [];

  const knownSkills = [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'fastapi', 'spring',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'jenkins', 'ci/cd',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
    'data analysis', 'data science', 'pandas', 'numpy', 'spark', 'hadoop',
    'html', 'css', 'sass', 'tailwind', 'bootstrap',
    'git', 'linux', 'agile', 'scrum', 'jira',
    'rest api', 'graphql', 'microservices', 'devops',
    'figma', 'photoshop', 'ui/ux', 'product management',
    'communication', 'leadership', 'problem solving', 'teamwork',
  ];

  const textLower = text.toLowerCase();
  return knownSkills.filter((skill) => textLower.includes(skill));
}

// ─── Clean text for embedding ───
function cleanText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, ' ')        // Remove HTML tags
    .replace(/[^a-z0-9\s#\+\-\.]/g, ' ')  // Keep only alphanumeric
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Main Seed Function ───
async function seedJobs() {
  const csvPath = path.join(__dirname, '../../../data/linkedin_job_postings.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    console.log('   Please ensure data/linkedin_job_postings.csv exists.');
    process.exit(1);
  }

  console.log('🌱 Starting job data seed...');
  console.log(`   Reading from: ${csvPath}`);

  // Check if jobs table already has data
  const existingCount = await db('jobs').count('id as count').first();
  if (parseInt(existingCount.count) > 0) {
    console.log(`⚠️  Jobs table already contains ${existingCount.count} records.`);
    const answer = process.argv.includes('--force') ? 'y' : 'n';
    if (answer !== 'y') {
      console.log('   Use --force flag to re-seed. Skipping...');
      process.exit(0);
    }
    console.log('   --force flag detected. Clearing existing data...');
    await db('recommendations').del();
    await db('bookmarks').del();
    await db('user_tracking_events').del();
    await db('jobs').del();
    await db('companies').del();
  }

  // Insert Fake Companies
  const FAKE_COMPANIES = [
    { name: 'TechNova Vietnam', logo_url: 'https://ui-avatars.com/api/?name=TechNova&background=0D8ABC&color=fff&size=128', description: 'Công ty công nghệ hàng đầu về AI và Big Data.', website: 'https://technova.vn' },
    { name: 'CloudSync Solutions', logo_url: 'https://ui-avatars.com/api/?name=CloudSync&background=F59E0B&color=fff&size=128', description: 'Cung cấp giải pháp Cloud và SaaS cho doanh nghiệp.', website: 'https://cloudsync.vn' },
    { name: 'FPT Software', logo_url: 'https://ui-avatars.com/api/?name=FPT+Software&background=EF4444&color=fff&size=128', description: 'Tập đoàn công nghệ hàng đầu Việt Nam.', website: 'https://fptsoftware.com' },
    { name: 'VNG Corporation', logo_url: 'https://ui-avatars.com/api/?name=VNG&background=10B981&color=fff&size=128', description: 'Kiến tạo công nghệ và phát triển hệ sinh thái số.', website: 'https://vng.com.vn' },
    { name: 'Tiki', logo_url: 'https://ui-avatars.com/api/?name=Tiki&background=3B82F6&color=fff&size=128', description: 'Nền tảng thương mại điện tử uy tín.', website: 'https://tiki.vn' },
    { name: 'Shopee Vietnam', logo_url: 'https://ui-avatars.com/api/?name=Shopee&background=F97316&color=fff&size=128', description: 'Sàn thương mại điện tử hàng đầu Đông Nam Á.', website: 'https://shopee.vn' },
    { name: 'Momo', logo_url: 'https://ui-avatars.com/api/?name=Momo&background=EC4899&color=fff&size=128', description: 'Siêu ứng dụng thanh toán số 1 Việt Nam.', website: 'https://momo.vn' },
    { name: 'ZaloPay', logo_url: 'https://ui-avatars.com/api/?name=ZaloPay&background=8B5CF6&color=fff&size=128', description: 'Ví điện tử quốc dân.', website: 'https://zalopay.vn' },
    { name: 'VNPay', logo_url: 'https://ui-avatars.com/api/?name=VNPay&background=ef4444&color=fff&size=128', description: 'Giải pháp thanh toán VNPAY-QR.', website: 'https://vnpay.vn' },
    { name: 'Viettel Digital', logo_url: 'https://ui-avatars.com/api/?name=Viettel&background=ef4444&color=fff&size=128', description: 'Trung tâm không gian mạng Viettel.', website: 'https://viettel.vn' },
    { name: 'Gojek', logo_url: 'https://ui-avatars.com/api/?name=Gojek&background=10b981&color=fff&size=128', description: 'Ứng dụng gọi xe công nghệ.', website: 'https://gojek.com' },
    { name: 'Be Group', logo_url: 'https://ui-avatars.com/api/?name=Be&background=f59e0b&color=fff&size=128', description: 'Nền tảng đa dịch vụ Việt Nam.', website: 'https://be.com.vn' },
    { name: 'AhaMove', logo_url: 'https://ui-avatars.com/api/?name=AhaMove&background=f97316&color=fff&size=128', description: 'Dịch vụ giao hàng siêu tốc.', website: 'https://ahamove.com' },
    { name: 'Giao Hàng Tiết Kiệm', logo_url: 'https://ui-avatars.com/api/?name=GHTK&background=10b981&color=fff&size=128', description: 'Dịch vụ giao hàng chuyên nghiệp.', website: 'https://ghtk.vn' },
    { name: 'Cốc Cốc', logo_url: 'https://ui-avatars.com/api/?name=CocCoc&background=10b981&color=fff&size=128', description: 'Trình duyệt web của người Việt.', website: 'https://coccoc.com' },
  ];
  const insertedCompanies = await db('companies').insert(FAKE_COMPANIES).returning(['id', 'name', 'logo_url']);
  console.log(`   🏢 Inserted ${insertedCompanies.length} fake companies`);

  // Read CSV file line by line
  const fileStream = fs.createReadStream(csvPath, { encoding: 'utf-8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers = null;
  let batch = [];
  let totalInserted = 0;
  let lineNumber = 0;
  const BATCH_SIZE = 200;
  const MAX_JOBS = 2000; // Limit for initial seed

  for await (const line of rl) {
    lineNumber++;

    // First line = headers
    if (!headers) {
      headers = parseCSVLine(line);
      console.log(`   CSV Headers: ${headers.join(', ')}`);
      continue;
    }

    if (totalInserted >= MAX_JOBS) break;

    try {
      const values = parseCSVLine(line);
      if (values.length < headers.length) continue;

      // Map CSV columns to our schema
      const row = {};
      headers.forEach((h, i) => { row[h] = values[i] || null; });

      // Skip if no description
      if (!row.description) continue;

      const fullText = `${row.description || ''} ${row.skills_desc || ''}`;
      const skills = extractSkills(fullText);
      const cleanedText = cleanText(fullText);

      // Pick a random company
      const randomCompany = insertedCompanies[Math.floor(Math.random() * insertedCompanies.length)];

      batch.push({
        title: (row.title || 'Untitled').substring(0, 300),
        description: row.description,
        skills_desc: row.skills_desc || null,
        required_skills: skills.length > 0 ? `{${skills.join(',')}}` : null, // PostgreSQL array literal
        experience_level: (row.formatted_experience_level || row.experience_level || 'Not specified').substring(0, 50),
        location: (row.location || 'Remote').substring(0, 200),
        company_id: randomCompany.id,
        company_name: randomCompany.name,
        salary_range: null,
        job_url: (row.job_url || row.application_url || null)?.substring(0, 500),
        is_active: true,
        indexed_in_pinecone: false,
        cleaned_text: cleanedText.substring(0, 10000),
      });

      // Flush batch
      if (batch.length >= BATCH_SIZE) {
        await db('jobs').insert(batch);
        totalInserted += batch.length;
        process.stdout.write(`\r   📊 Inserted ${totalInserted} jobs...`);
        batch = [];
      }
    } catch (err) {
      // Skip bad rows silently
      continue;
    }
  }

  // Insert remaining
  if (batch.length > 0) {
    await db('jobs').insert(batch);
    totalInserted += batch.length;
  }

  console.log(`\n✅ Seed complete! Inserted ${totalInserted} jobs into PostgreSQL.`);
  process.exit(0);
}

seedJobs().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
