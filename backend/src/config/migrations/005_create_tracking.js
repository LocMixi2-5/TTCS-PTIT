// ═══════════════════════════════════════════════════
// Migration: Create user_tracking_events table
// High-volume event storage for implicit feedback
// ═══════════════════════════════════════════════════

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('user_tracking_events', (table) => {
    table.bigIncrements('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users');
    table.uuid('session_id').notNullable();
    table.string('event_type', 20).notNullable(); // CLICK, DWELL_TIME, BOOKMARK, APPLY, DISMISS, SEARCH
    table.integer('job_id').unsigned()
      .references('id').inTable('jobs');
    table.jsonb('payload').defaultTo('{}');
    table.timestamp('client_timestamp').notNullable();
    table.timestamp('server_timestamp').defaultTo(knex.fn.now());

    // Indexes optimized for ML training queries
    table.index(['user_id', 'server_timestamp']);
    table.index(['job_id', 'event_type']);
    table.index('session_id');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user_tracking_events');
};
