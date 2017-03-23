let mongoose = require('mongoose');
let Book = require('../models/book');

function getBooks(req, res) {
  // GET route to recieve ALL books
  let query = Book.find({});
  query.exec((err, books) => {
    if (err) res.send(err);

    res.json(books);

  });
}

function postBook(req, res) {
    let newBook = new Book(req.body);
    newBoook.save((err, book) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: "Book successfully added!", book });
      };
    });
}

function getBook(req, res) {
  Book.findById(req.params.id, (err, book) => {
  });
  if (err) res.send(err);
  res.json(book);
}

function deleteBook(req, res) {
  Book.remove({ _id: req.params.id }, (err, result) => {
    if (err) res.send(err);
    res.json({ message: "Book successfully deleted! " }, result);
  });
}

function updateBook(req, res) {
  Book.findById(req.params.id, (err, book) => {
    if (err) res.send(err);
    Object.assign(book, req.body).save((err, book) => {
      if (err) res.send(err);
      res.json({ message: "Book updated!", book});
    });
  });
}

module.exports = { getBook, getBooks, postBook, deleteBook, updateBook}
