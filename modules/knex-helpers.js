const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const knexHelpers = {
  //retrieve all records of a resource.
  getAllTable: table => {
    return database(table)
    .select()
  },
  //find a specific record of a resource using id
  findRecordWithId: (table, id) => {
    return database(table)
    .select()
    .where('id', id)
  }
};

module.exports = knexHelpers
