
exports.up = function(knex) {
  return knex.schema.createTable('papers', table => {
    table.increments('id').primary();
    table.string('title');
    table.string('author');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('papers')
};
