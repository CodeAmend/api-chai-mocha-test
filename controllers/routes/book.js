let mongoose = require('mongoose');
let Book = require('../models/book');

/*
 * GET route to recieve ALL books
 */
function getBooks(req, res) {
  let query = Book.find({});
  query.exec((err, books) => {
    if (err) res.send(err);

    res.json(books);

  });
}

module.exports = {getBooks};
