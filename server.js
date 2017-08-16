const express = require('express');
const bodyParser = require('body-parser')
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'jetfuel';

app.use(bodyParser.json())
app.use(express.static('public'))

app.locals.folders = [{id: 1, name: 'recipes'}]

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.route('/api/v1/folders')
  .post((req, res) => {
    const id = Date.now()
    const { name } = req.body

    if(!name){ return res.status(422).send('Must include a name in body ') }
    res.status(201).json({ id, name })
  })
  .get((req, res) => {
    const { id } = request.params
    const message = app.locals.secrets[id]
  })

app.route('/api/v1/links')
  .post((req, res) => {
    const id = Date.now()
          birth = Date.now();

    const { name, origUrl, shortUrl, folderId } = req.body

    if(!name || !origUrl || !shortUrl) {
      return res.status(422).send('Missing information in body')
    }
    res.status(201).json({ id, name, origUrl, shortUrl, birth, folderId})
  })
  .get((req, res) => {

  })

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
})
