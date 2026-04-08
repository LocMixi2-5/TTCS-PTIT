// ═══════════════════════════════════════════════════
// Database Configuration (Knex.js)
// ═══════════════════════════════════════════════════
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: './migrations',
    },
    pool: {
      min: 2,
      max: 20,
    },
  },
};
