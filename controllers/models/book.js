let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BookSchema = Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  pages: { type: Number, required: true, min: 1 },
  year: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false
  }
);

BookSchema.pre('save', next => {
  let now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('book', BookSchema);
