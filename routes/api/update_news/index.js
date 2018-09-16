const express = require('express');
const app = express();
const mongoose = require('mongoose');
const News = mongoose.model('news');
const HttpError = require('../../../libs/error');

app.put('/:news_id', (req, res, next) => {
  const newsId = req.params.news_id;
  News.findById(newsId)
    .then(news => {
      if (!news) {
        throw new HttpError('News not found.', 404);
      }
      news.text = req.body.text;
      news.theme = req.body.theme;
      news
        .save()
        .then(news => {
          News.find()
            .populate('user')
            .exec()
            .then(news => {
              return res.json(news);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = app;
