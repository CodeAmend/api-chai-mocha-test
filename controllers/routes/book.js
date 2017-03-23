let mongoose = require('mongoose');
let Book = require('../models/book');

module.exports = {

  getBooks(req, res) {
    // GET route to recieve ALL books
    let query = Book.find({});
    query.exec((err, books) => {
      if (err) res.send(err);

      res.json(books);

    });
  },
  postBook(req, res) {
      let newBook = new Book(req.body);
      newBoook.save((err, book) => {
        if (err) {
          res.send(err);
        } else {
          res.json({ message: "Book successfully added!", book });
        }
      });
  },
  getBook(req, res) {
    Book.findById(req.params.id, (err, book) => {
      if (err) res.send(err);
      res.json(book);
    });
  },

}
