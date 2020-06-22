const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Publications';

//landing page
app.get('/', (req, res) => {
  res.send('Hello, Publications!');
});

//get all papers
app.get('/api/v1/papers', (req, res) => {
  database('papers').select()
  .then(papers => res.status(200).json(papers))
  .catch(error => res.status(500).json({ error }));
});

//get all footnotes
app.get('/api/v1/footnotes', (req, res) => {
  database('footnotes').select()
  .then(footnotes => res.status(200).json(footnotes))
  .catch(error => res.status(500).json({ error }));
});

//create a paper
app.post('/api/v1/papers', (req, res) => {
  const paper = req.body;
  const requiredAttributes = ['title', 'author'];

  for (let attribute of requiredAttributes) {
    const formatMsg = 'Expected format: { title:<string>, author:<string> }.'
    const errorMessage = `${formatMsg} Your missing '${attribute}' property.`

    if (!paper[attribute]){
      return res.status(422).send({ error: errorMessage });
    };
  };

  database('papers').insert(paper, '*')
  .then(paper => res.status(201).send({ paper }))
  .catch(error => res.send({ error }));
});

//create a footnote
app.post('/api/v1/footnotes/:paper_id', (req, res) => {

});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
});
