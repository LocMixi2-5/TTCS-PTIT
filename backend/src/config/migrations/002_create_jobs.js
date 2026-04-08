// ═══════════════════════════════════════════════════
// Migration: Create jobs table
// Stores job metadata (vectors go to Pinecone)
// ═══════════════════════════════════════════════════

/**
 * @param { import("knex").Knex } knex
 */
exports.up = function (knex) {
  return knex.schema.createTable('jobs', (table) => {
    table.increments('id').primary();
    table.string('title', 300).notNullable();
    table.text('description').notNullable();
    table.text('skills_desc');
    table.specificType('required_skills', 'text[]'); // PostgreSQL array
    table.string('experience_level', 50);
    table.string('location', 200);
    table.string('company_name', 200);
    table.string('salary_range', 100);
    table.string('job_url', 500);
    table.boolean('is_active').defaultTo(true);
    table.boolean('indexed_in_pinecone').defaultTo(false);
    table.text('cleaned_text'); // Pre-processed text for embedding
    table.timestamps(true, true);

    // Indexes
    table.index('is_active');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('jobs');
};
