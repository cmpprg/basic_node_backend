
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('footnotes').del()
    .then( () => knex('papers').del())
    .then(function () {
      // Inserts seed entries
      return knex('papers').insert({
        title: 'paper1', author: 'author1', publisher: 'publisher1'
      }, 'id')
      .then( paper => {
        return knex('footnotes').insert([
          { note: 'Lorem', paper_id: paper[0] },
          { note: 'Dolor', paper_id: paper[0] }
        ])
      })
      then(() => console.log("Seeding Complete!"))
      .catch(error => console.log(`Error Seeding data: ${error}`))
    })
    .catch(error => console.log(`Error Seeding data: ${error}`));
};
