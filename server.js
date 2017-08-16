const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[enviroment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'jetfuel';
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/api/v1/folders')
  .get((req, res) => {
    database('folders').select()
    .then(folders => {
      res.status(200).json(folders)
    })
  })
  .post((req, res) => {
    const newFolder = req.body;

    for(let requiredParameter of ['name']) {
      if(!newFolder[requiredParameter]) {
        return res.status(422).json({ error: `Missing required parameter ${requiredParameter}`})
      }
    }
    database('folders').insert(newFolder, 'id')
      .then(folder => {
        res.status(201).json({ id: folder[0] })
      })
      .catch(error => {
        res.status(500).json({ error })
      })
  })

app.route('/api/v1/links')
  .get((req, res) => {
    database('links').select()
    .then(links => {
      res.status(200).json(links)
    })
  })
  .post((req, res) => {
    const newLink = req.body;

    for(let requiredParameter of ['name', 'orig_url', 'short_url', 'folder_id']) {
      if(!newLink[requiredParameter]) {
        res.status(422).json({ error: `Missing required parameter ${requiredParameter}`})
      }
    }
    database('links').insert(newLink, 'id')
    .then(link => {
      res.status(201).json({ id: link[0] })
    })
    .catch(error => {
      res.status(500).json( {error} )
    })
  })



// app.route('/api/v1/links')
//   .post((req, res) => {
//     const id = Date.now()
//           birth = Date.now();
//
//     const { name, origUrl, shortUrl, folderId } = req.body
//
//     if(!name || !origUrl || !shortUrl) {
//       return res.status(422).send('Missing information in body')
//     }
//     res.status(201).json({ id, name, origUrl, shortUrl, birth, folderId})
//   })
//   .get((req, res) => {
//   })

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})
