const express = require('express');
const bodyParser = require('body-parser')
const shortid = require('shortid');
const app = express();

const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[enviroment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.locals.title = 'jetfuel';
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

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
    newLink.short_url = `/${shortid.generate()}`
    for(let requiredParameter of ['name', 'orig_url','folder_id']) {
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
  });


app.get('/api/v1/folders/:id', (req, res) => {
  database('folders')
  .where('id', req.params.id).
  select()
    .then(folders => {
      if (folders.length) {
        res.status(200).json(folders);
      } else {
        res.status(404).json({
          error: `Could not find folder with id of ${req.params.id}`
        })
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.get('/api/v1/folders/:id/links', (req, res) => {
  database('links').where('folder_id', req.params.id)
  .select()
    .then(links => {
      res.status(200).json(links)
    })
    .catch(error => {
      res.status(500).json({ error })
    })
});

app.get('/api/v1/links/:id', (req, res) => {
  database('links').where('id', req.params.id)
  .select()
  .then(links => {
    res.status(302).redirect(links[0].orig_url)
  })
  .catch(error => {
    res.status(500).json({ error })
  })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})

module.exports = app;
