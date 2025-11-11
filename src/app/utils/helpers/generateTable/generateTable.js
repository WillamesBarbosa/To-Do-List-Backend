const database = require("../../../../database/config/config-knex");

async function generateTable(nameTable){
    return await database.schema.createTable(nameTable, (table) => {
      table.text('id').primary();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('password').notNullable();
      table.timestamp('created_at').defaultTo(new Date());
      table.timestamp('updated_at').nullable();
    });
}

module.exports = generateTable;