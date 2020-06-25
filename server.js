const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const knexHelper = require('./modules/knex-helpers.js');
const checkHelper = require('./modules/check-helpers.js')

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Publications';

//start of routes:
//landing page
app.get('/', (req, res) => {
  res.send('Hello, Publications!');
});

//get all papers
app.get('/api/v1/papers', (req, res) => {
  knexHelper.getAllTable('papers')
  .then(papers => res.status(200).json(papers))
  .catch(error => res.status(500).json({ error }));
});

//get all footnotes
app.get('/api/v1/footnotes', (req, res) => {
  knexHelper.getAllTable('footnotes')
  .then(footnotes => res.status(200).json(footnotes))
  .catch(error => res.status(500).json({ error }));
});

//create a paper
app.post('/api/v1/papers', (req, res) => {
  const paper = req.body;
  const paperAttributes = { title:'string', author:'string' };
  const errorMessage = checkHelper.checkAttributesInBody(paperAttributes, paper);

  if (errorMessage){
    return res.status(422).send({ error: errorMessage });
  };

  database('papers').insert(paper, '*')
  .then(paper => res.status(201).send({ paper }))
  .catch(error => res.send({ error }));
});

//create a footnote
app.post('/api/v1/footnotes/:paper_id', (req, res) => {
  const footnote = req.body;
  const footnoteAttributes = { note:'string' };
  const errorMessage = checkHelper.checkAttributesInBody(footnoteAttributes, footnote);
  footnote.paper_id = req.params.paper_id;

  if (errorMessage){
    return res.status(422).send({ error: errorMessage });
  };

  knexHelper.findRecordWithId('papers', req.params.paper_id)
  .then( paper => {
    if (paper.length) {
      database('footnotes').insert(footnote, '*')
      .then( record => res.status(200).json(record))
      .catch(error => res.status(500).json({ error }));
    } else {
      res.status(404).json({ error: 'could not find paper with that id' });
    };
  })
  .catch(error => res.status(500).json({ error }));
});

//find a specific paper
app.get('/api/v1/papers/:id', (req, res) => {
  knexHelper.findRecordWithId('papers', req.params.id)
  .then(record => {
    if (record.length) {
      res.status(200).json(record);
    } else {
      res.status(404).json({ error: 'could not find paper with that id' });
    };
  })
  .catch(error => res.status(500).json({ error }));
});

app.get('/api/v1/papers/:id/footnotes', (req, res) => {
  knexHelper.findRecordWithId('papers', req.params.id)
  .then(paperRecord => {
    if (paperRecord.length) {
      database('footnotes').select().where('paper_id', req.params.id)
      .then(footnotesRecord => res.status(200).json(footnotesRecord))
      .catch(error => res.status(500).json({ error }));
    } else {
      res.status(404).json({ error: 'Could not find paper with that id' })
    };
  })
  .catch(error => res.status(500).json(error));
});
//start server and have it listening.
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});
