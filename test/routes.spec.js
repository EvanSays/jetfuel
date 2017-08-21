process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const enviroment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[enviroment];
const database = require('knex')(configuration);

describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server).get('/').end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });
  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server).get('/sad').end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.rollback().then(() => {
      database.migrate.latest().then(() => {
        database.seed.run().then(() => {
          done();
        })
      });
    });
  });

  it('GET /api/v1/folders', (done) => {
    chai.request(server)
    .get('/api/v1/folders')
    .end((err, res) => {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.equal(1);
      res.body[0].should.have.property('name');
      res.body[0].name.should.equal('recipes');
      res.body[0].should.have.property('created_at');
      res.body[0].should.have.property('updated_at');
      done();
    })
  })
  describe('GET /api/v1/links', () => {
    it('should get all the links', (done) => {
      chai.request(server)
      .get('/api/v1/links')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Baking Bread');
        res.body[0].should.have.property('orig_url');
        res.body[0].orig_url.should.equal('http://hugechallah.com/tasty/break');
        res.body[0].should.have.property('short_url');
        res.body[0].short_url.should.equal('http://breakbread.com/ajIjdsif');
        res.body[0].should.have.property('folder_id');
        res.body[0].folder_id.should.equal(1);
        res.body[0].should.have.property('updated_at');
        res.body[0].should.have.property('created_at');
        done();
      })
    })
  })
  describe('POST /api/v1/folders', () => {
    it('should create a new folder', (done) => {
      chai.request(server).post('/api/v1/folders').
      send({
        "name": 'Search Engines'
      }).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        chai.request(server).get('/api/v1/folders').end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(2);
          res.body[1].should.have.property('id');
          res.body[1].id.should.equal(2);
          res.body[1].should.have.property('name');
          res.body[1].name.should.equal('Search Engines');
          res.body[1].should.have.property('created_at');
          res.body[1].should.have.property('updated_at');
          done();
        })
      })
    })
    it('should not create a folder with missing data', (done) => {
      chai.request(server).post('/api/v1/folders').send({}).end((err, res) => {
        res.should.have.status(422);
        res.body.error.should.equal('Missing required parameter name');
        done();
      });
    });
    it('should not create a folder with the same name', (done) => {
      chai.request(server)
      .post('/api/v1/folders')
      .send({name: "recipes"})
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
    });
  })
  describe('POST /api/v1/links', () => {
    it('should create a new link', (done) => {
      chai.request(server)
      .post('/api/v1/links').
      send({
        "name": "Tortilla Soup",
        "orig_url": "http://mytortillasoup.com/tasty/break",
        "short_url": "http://jetfuelcom/ajIjdsif",
        "folder_id": 1
      }).end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        chai.request(server).get('/api/v1/links').end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.length.should.equal(3);
          res.body[2].should.have.property('name');
          res.body[2].should.have.property('orig_url');
          res.body[2].orig_url.should.equal('http://mytortillasoup.com/tasty/break');
          res.body[2].should.have.property('short_url');
          res.body[2].should.have.property('folder_id');
          res.body[2].folder_id.should.equal(1);
          done();
        })
      })
    })
    it.skip('should not create a link with missing folder_id', (done) => {
      chai.request(server).post('/api/v1/links')
      .send({
          name: "Churros",
          orig_url: "http://allthechurrosintheworld.com"
        })
      .end((err, res) => {
        res.should.have.status(422);
        res.body.error.should.equal('Missing required parameter folder_id');
        done();
      });
    });
  })
  describe('GET /api/v1/folders/:id/', () => {
    it('should get all the links in a specified folder ', (done) => {
        chai.request(server)
        .get('/api/v1/folders/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body[0].should.have.property('name');
          res.body[0].name.should.equal('recipes');
          res.body[0].should.have.property('created_at');
          res.body[0].should.have.property('updated_at');
        done()
      })
    })
    it('should not get a link if the folder number does not exist', (done) => {
        chai.request(server)
        .get('/api/v1/folders/3')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.error.should.equal('Could not find folder with id of 3')
        done()
      })
    })
  })
  describe('GET /api/v1/folders/${id}/links', () => {
    it('should get a link by id', (done) => {
      chai.request(server)
      .get('/api/v1/folders/1/links')
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].should.have.property('id');
        res.body[0].id.should.equal(1);
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Baking Bread');
        res.body[0].should.have.property('created_at');
        res.body[0].should.have.property('updated_at');
      done()
      })
    })
    it('should not get a link if the id number does not exist', (done) => {
        chai.request(server)
        .get('/api/v1/folders/asdf/links')
        .end((err, res) => {
          res.should.have.status(500);
        done()
      })
    })
  })
});
