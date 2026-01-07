        exports.up = async function (knex) {
        await knex.schema.alterTable('tasks', table => {
            table.string('status').notNullable().defaultTo('not_started');;
        });
        };



        exports.down = function (knex) {
        return knex.schema.alterTable('tasks', table => {
            table.dropColumn('status');

            
        });
        };