const db = require('./src/config/database');
async function check() {
  const cvs = await db('cvs').orderBy('id', 'desc').limit(5);
  console.log(cvs.map(c => ({id: c.id, status: c.processing_status, error: c.error_message})));
  process.exit(0);
}
check();
