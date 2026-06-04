const db = require('./src/config/database');

async function test() {
  let latestCv = { id: 1 };
  let req = { user: { id: 1 } };

  let query = db.with('job_popularity', db.raw(`
      SELECT job_id, COUNT(*) as pop_score 
      FROM user_tracking_events 
      GROUP BY job_id
    `));

  if (req.user) {
    query = query.with('user_affinity', db.raw(`
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
    `, [req.user.id]));
  }

  query = query.select(
    'j.id', 'j.title'
  ).from('jobs as j')
  .leftJoin('companies as c', 'j.company_id', 'c.id')
  .leftJoin('job_popularity as jp', 'j.id', 'jp.job_id')
  .where('j.is_active', true);

  if (req.user) {
    query = query.leftJoin('user_affinity as ua', 'j.id', 'ua.job_id');
  }

  if (latestCv) {
    query = query.leftJoin('recommendations as r', function () {
      this.on('j.id', 'r.job_id').andOn('r.cv_id', db.raw('?', [latestCv.id]));
    });
    query = query.orderByRaw(`
      (COALESCE(r.match_score, 0) * 0.7) + 
      (LEAST(COALESCE(jp.pop_score, 0), 50) * 0.2) + 
      (LEAST(COALESCE(ua.affinity_score, 0), 100) * 0.3) DESC NULLS LAST, 
      j.created_at DESC
    `);
  }

  console.log(query.toString());
  process.exit(0);
}

test();
