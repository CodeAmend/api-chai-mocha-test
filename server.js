let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8080;
let book = require('./controllers/routes/book');
let config = require('config'); //we load the db location from the JSON files
//db options
let options = {
  server: {
    socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }
  },
  replset: {
    socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 }
  }

};// Todo: what is config.DBHost
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error: ') );

// Do not show log in test env
// morgan would interfere with test output.
if (config.util.getEnv('NODE_ENV') !== 'test') {
  // 'combined' for Apache style LOGs
  app.use(morgan('combined'));
}

app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));

app.get('/', (req, res) => res.json({ message: "Welcome to the bookstore" }))

app.route('/book')
  .get(book.getBooks)
  .post(book.postBook);
app.route('/book/:id')
  .get(book.getBook)
//   .delete(book.deleteBook)
//   .put(book.updateBook)

app.listen(port);
console.log("Listening to port: ", port);

// export for testing purposes.
module.exports = app;
