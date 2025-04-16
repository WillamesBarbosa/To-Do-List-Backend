exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.string('email', 255).notNullable().unique();
      table.string('password', 255).notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').nullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };