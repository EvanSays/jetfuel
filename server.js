const express = require('express'); // make instance of express
const bodyParser = require('body-parser') // make instance of body-parser, parses body as middleware
const shortid = require('shortid'); // instance of shrort id node module
const validator = require('validator');  // instance of http validation
const app = express();  //assign app to instance of express

const enviroment = process.env.NODE_ENV || 'development'; // if enviroment is dev, use that. Otherwise, use the default. Assign to enviroment var.
const configuration = require('./knexfile')[enviroment]; // assigning configuration knexfile to the type of enviroment
const database = require('knex')(configuration); // the database we use, is this knex config, from the enviroment it was specified as

app.set('port', process.env.PORT || 3000); // set our port to its default of 3000 or use the port specified
app.locals.title = 'jetfuel'; // there is a titles local on our comp as jetfuel
app.use(bodyParser.json()); // middleware that parsers the data to json()
app.use(express.static('public')) // will have to lookup
app.use(bodyParser.urlencoded({ extended: true })); // another middleware, must lookup

app.get('/', (req, res) => { // home path set to the directory name + /index.html
  res.sendFile(__dirname + '/index.html')
})

app.route('/api/v1/folders') // set the path to folders
  .get((req, res) => { // two argumenst request, result. Get request
    database('folders').select() // select the folders database
    .then(folders => { // then resolve promise
      res.status(200).json(folders) // set status as 200 and parses to json
    })
  })
  .post((req, res) => { // post request
    const newFolder = req.body; // set new folder to the body that we want to add

    for(let requiredParameter of ['name']) { // loop through these keywords
      if(!newFolder[requiredParameter]) { // if keywords / keys dont exist...
        return res.status(422).json({ error: `Missing required parameter ${requiredParameter}`}) // throw an error with the missing info
      }
    }
    database('folders').insert(newFolder, 'id')/// go to folders databas, then insert the whole body with an id to add 1 to.
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

    if(!validator.isURL(newLink.orig_url)){
      return res.status(500).json( {error} )
    }

    newLink.short_url = `http://jetfuelturbo.com/${shortid.generate()}`

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
  .where('id', req.params.id)
  .select()
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
  database('links')
  .where('folder_id', req.params.id)
  .select()
  .then(links => {
    console.log('SERVER', links);
    res.status(200).json(links)
  })
  .catch(error => {
    res.status(500).json({ error })
  })
});

app.get('/api/v1/links/:id', (req, res) => {
  database('links')
  .where('id', req.params.id)
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
