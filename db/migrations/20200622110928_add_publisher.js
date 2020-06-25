
exports.up = function(knex) {
  return knex.schema.table('papers', table => {
    table.string('publisher');
  });
};

exports.down = function(knex) {
  return knex.schema.table('papers', table => {
    table.dropColumn('publisher');
  });
};
