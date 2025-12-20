        exports.up = async function (knex) {
        await knex.schema.alterTable('tasks', table => {
            table.uuid('user_id').notNullable().alter();
            table
            .foreign('user_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
            // CASCADE pois se o usuario for deletado, suas tasks devem ser apagadas em conjunto
        });
        };


        exports.down = function (knex) {
        return knex.schema.alterTable('tasks', table => {
            table.dropColumn('user_id');

            
        });
        };
