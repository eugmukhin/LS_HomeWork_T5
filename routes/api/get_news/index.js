const express = require('express');
const app = express();
const mongoose = require('mongoose');
const News = mongoose.model('news');

app.get('/', (req, res, next) => {
  News.find()
    .populate('user')
    .exec()
    .then(news => {
      return res.json(news);
    })
    .catch(next);
});

module.exports = app;
