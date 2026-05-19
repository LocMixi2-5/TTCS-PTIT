// ═══════════════════════════════════════════════════
// Migration: Create recommendations table
// Caches AI matching results for quick retrieval
// ═══════════════════════════════════════════════════

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('recommendations', (table) => {
      table.increments('id').primary();
      table.integer('cv_id').unsigned().notNullable()
        .references('id').inTable('cvs').onDelete('CASCADE');
      table.integer('job_id').unsigned().notNullable()
        .references('id').inTable('jobs');
      table.decimal('match_score', 5, 2).notNullable(); // 0.00 to 100.00
      table.specificType('matched_skills', 'text[]');    // Skills that matched
      table.integer('rank_position').notNullable();
      table.timestamps(true, true);

      table.unique(['cv_id', 'job_id']);
      table.index(['cv_id', 'rank_position']);
    })
    .createTable('bookmarks', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
        .references('id').inTable('users').onDelete('CASCADE');
      table.integer('job_id').unsigned().notNullable()
        .references('id').inTable('jobs').onDelete('CASCADE');
      table.timestamps(true, true);

      table.unique(['user_id', 'job_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('bookmarks')
    .dropTableIfExists('recommendations');
};
