const db = require('./src/config/database');

async function check() {
  // 1. Check column type
  const cols = await db.raw(
    `SELECT column_name, data_type FROM information_schema.columns 
     WHERE table_name = 'user_tracking_events' AND column_name = 'client_timestamp'`
  );
  console.log('Column type:', JSON.stringify(cols.rows));

  // 2. Total data + range
  const summary = await db.raw(
    `SELECT COUNT(*) as total, MIN(client_timestamp) as oldest, MAX(client_timestamp) as newest 
     FROM user_tracking_events`
  );
  console.log('Data summary:', JSON.stringify(summary.rows));

  // 3. How many rows SHOULD be deleted by the cleanup
  const shouldDelete = await db.raw(
    `SELECT COUNT(*) as count FROM user_tracking_events 
     WHERE client_timestamp < NOW() - INTERVAL '2 minutes'`
  );
  console.log('Rows older than 2 min:', JSON.stringify(shouldDelete.rows));

  // 4. NOW() value in DB
  const now = await db.raw(`SELECT NOW() as db_now`);
  console.log('DB NOW():', JSON.stringify(now.rows));

  process.exit(0);
}

check().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
