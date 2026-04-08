// ═══════════════════════════════════════════════════
// Migration: Create users table
// ═══════════════════════════════════════════════════

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).unique().notNullable();
    table.string('password_hash', 255).notNullable();
    table.string('full_name', 100);
    table.string('preferred_language', 10).defaultTo('vi'); // 'vi' or 'en'
    table.timestamps(true, true); // created_at, updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
