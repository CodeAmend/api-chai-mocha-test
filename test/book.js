// MongooseError: Cannot overwrite `book` model once compiled.
// deleting require cache seems to help
Object.keys(require.cache).map(key => { delete require.cache[key] });
process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let Book = require('../controllers/models/book');

// require dev dependencies
let chai = require('chai');
let should = chai.should();
let assert = chai.assert;
let chaiHttp = require('chai-http');
let server = require('../server');

const log = (msg) => {
  console.log.bind(console, "\n\n\n")(msg);
}

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
          // res.should.have.status(200);
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
          res.should.have.status(206)
          res.body.should.be.a('object');
          res.body.should.have
            .property('errors')
            .property('pages')
            .property('kind')
            .eql('required')
          done();
        });
    });
    it("should POST a book with all fields", (done) => {
      let book = {
        title: "Non-Binaray Femenist",
        author: "Chet Angel",
        pages: 455,
        year: 1985
      }
      chai.request(server)
        .post('/book')
        .send(book)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have
            .property('message')
            .eql("Book successfully added!");
          res.body.book.should.have.property('title')
          res.body.book.should.have.property('author')
          res.body.book.should.have.property('pages')
          res.body.book.should.have.property('year')
          done();
      });
    });
  });

  describe("/GET/:id book", () => {

    it("should GET a book by given id", (done) => {
      let tempBook = new Book({
        title: 'The Best Book Ever',
        author: 'Steven',
        year: 1911,
        pages: 45
      });
      tempBook.save((err, book) => {
        chai.request(server)
          .get(`/book/${book._id}`)
          .send(book)
          .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object');
            res.body.should.have.property('title').eql("The Best Book Ever");
            res.body.should.have.property('author').eql("Steven");
            res.body.should.have.property('year').eql(1911);
            res.body.should.have.property('pages').eql(45);
            res.body.should.have.property('_id').eql(book.id);
            done();
          });
      });
    });

  }); // /GET/:id book

  describe("/PUT/:id book", () => {
    it("should UPDATE a book given the id", (done) => {
      let temp_book = new Book({
        title: 'The Chronic',
        author: 'Busta',
        year: 1955,
        pages: 4500
      });
      temp_book.save((err, book) => {
        chai.request(server)
          .put(`/book/${book.id}`)
          .send({
            title: 'Not The Chronic',
            author: 'Not Busta',
            year: 1,
            pages: 1000
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.book.title.should.eql("Not The Chronic");
            res.body.book.author.should.eql("Not Busta");
            res.body.book.year.should.eql(1);
            res.body.book.pages.should.eql(1000);
            assert.equal(book._id, temp_book._id.toString());
            done();
          });
      });
    });
  }); // /PUT/:id book

  describe("/DELETE/:id book", () => {
    it("should DELETE book with id", (done) => {
      let book = new Book({
        title: 'The book that got deleted',
        author: 'Bad Author',
        year: 1455,
        pages: 377
      });
      book.save((err, book) => {
        chai.request(server)
          .delete(`/book/${book.id}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message')
              .eql('Book successfully deleted!');
            res.body.result.should.have.property('n').eql(1);
            res.body.result.should.have.property('ok').eql(1);
            done();
          });
      });
    });
  });

});
