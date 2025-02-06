exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table) {
    table.uuid('id').defaultTo(knex.raw('gen_random_uuid()')).primary();
    table.string('title', 255).notNullable();
    table.string('description', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('tasks');
};