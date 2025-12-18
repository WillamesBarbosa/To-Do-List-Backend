        exports.up = async function (knex) {
        await knex.schema.alterTable('tasks', table => {
            table.uuid('user_id');
        });

        await knex('tasks').update({
            user_id: '101133f0-309f-4c5e-abbc-2d5b39a9d294'
        });
        };



        exports.down = function (knex) {
        return knex.schema.alterTable('tasks', table => {
            table.dropColumn('user_id');

            
        });
        };
