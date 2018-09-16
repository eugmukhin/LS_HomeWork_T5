const express = require('express');
const app = express();
const auth = require('../../../libs/auth');
const mongoose = require('mongoose');
const News = mongoose.model('news');

app.post('/', auth.isAuthenticated, (req, res, next) => {
  const newNews = new News();
  const { userId, text, theme, date } = req.body;
  newNews.user = userId;
  newNews.text = text;
  newNews.theme = theme;
  newNews.date = date;
  newNews
    .save()
    .then(() => {
      News.find()
        .populate('user')
        .exec()
        .then(news => {
          return res.json(news);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = app;
