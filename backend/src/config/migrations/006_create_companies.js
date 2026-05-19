// ═══════════════════════════════════════════════════
// Migration: Create companies table
// Stores company profiles for the Company Hub feature
// ═══════════════════════════════════════════════════

/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function (knex) {
  await knex.schema.createTable('companies', (table) => {
    table.increments('id').primary();
    table.string('name', 200).notNullable();
    table.string('logo_url', 500);
    table.text('description');
    table.string('website', 300);
    table.timestamps(true, true);
  });

  // Add company_id to jobs
  await knex.schema.alterTable('jobs', (table) => {
    table.integer('company_id').unsigned().references('id').inTable('companies').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.dropForeign('company_id');
    table.dropColumn('company_id');
  });
  await knex.schema.dropTableIfExists('companies');
};
