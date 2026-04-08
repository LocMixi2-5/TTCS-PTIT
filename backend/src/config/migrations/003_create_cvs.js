// ═══════════════════════════════════════════════════
// Migration: Create CVs table
// Supports multiple CV versions per user
// ═══════════════════════════════════════════════════

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('cvs', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.string('filename', 255).notNullable();
    table.string('file_path', 500).notNullable();
    table.text('raw_text'); // Extracted text from PDF
    table.specificType('extracted_skills', 'text[]'); // Parsed skill keywords
    table.string('processing_status', 20).defaultTo('pending'); // pending | processing | completed | failed
    table.text('error_message');
    table.timestamps(true, true);

    // Index for quick lookup by user
    table.index(['user_id', 'created_at']);
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('cvs');
};
