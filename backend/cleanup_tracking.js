const db = require('./src/config/database');

async function cleanupNow() {
  console.log('🧹 Running manual cleanup...');
  
  const before = await db('user_tracking_events').count('* as count').first();
  console.log(`Before: ${before.count} rows`);

  const deleted = await db('user_tracking_events')
    .whereRaw("client_timestamp < NOW() - INTERVAL '2 minutes'")
    .del();
  
  console.log(`Deleted: ${deleted} rows`);

  const after = await db('user_tracking_events').count('* as count').first();
  console.log(`After: ${after.count} rows`);

  process.exit(0);
}

cleanupNow().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
