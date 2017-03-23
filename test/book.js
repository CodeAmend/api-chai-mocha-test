process.env.NODE_ENV = 'test';

// MongooseError: Cannot overwrite `book` model once compiled.
// deleting require cache seems to help
Object.keys(require.cache).map(key => { delete require.cache[key] })
let mongoose = require('mongoose');
let Book = require('../controllers/models/book');

// require dev dependencies
let chai = require('chai');
let should = chai.should;
let chaiHttp = require('chai-http');
let server = require('../server');

chai.use(chaiHttp);

describe("Books", () => {
  beforeEach((done) => {
    Book.remove({}, err => done() );
  });

  describe("/GET book", () => {
    it('should get all the books', (done) => {
      chai.request(server)
        .get('/book')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.eql(0);
          done();
        });
    })
  });

  describe("/POST book", () => {
    it('should NOT post a book without pages field', (done) => {
      let book = {
        title: "Non-Binaray Femenist",
        author: "Chet Angel",
        year: 1985
      }
      chai.request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
          // 206 Partial Content
          res.should.have.status(206);
          res.body.should.be.a('object');
          res.body.should.have
            .property('errors')
            .property('pages')
            .property('kind')
            .eql('required')
          done();
        });
    });
  });


});
