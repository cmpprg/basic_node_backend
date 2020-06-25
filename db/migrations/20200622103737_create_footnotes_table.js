
exports.up = function(knex) {
  return knex.schema.createTable('footnotes', table => {
    table.increments('id').primary();
    table.string('note');
    table.integer('paper_id').unsigned().notNull();
    table.foreign('paper_id').references('papers.id');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('footnotes');
};
