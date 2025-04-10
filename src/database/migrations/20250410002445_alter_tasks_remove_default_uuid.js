exports.up = async function(knex) {
    return knex.raw(`
      ALTER TABLE tasks
      ALTER COLUMN id DROP DEFAULT;
    `);
  };
  
  exports.down = async function(knex) {
    return knex.raw(`
      ALTER TABLE tasks
      ALTER COLUMN id SET DEFAULT gen_random_uuid();
    `);
  };