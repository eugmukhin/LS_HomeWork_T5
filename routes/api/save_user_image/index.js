const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const HttpError = require('../../../libs/error');
const path = require('path');

app.post('/:user_id', (req, res, next) => {
  const userId = req.params.user_id;

  if (!req.user._id.equals(userId)) {
    throw new HttpError('Доступ закрыт', 403);
  }

  User.findById(userId)
    .then(user => {
      if (!user) {
        throw new HttpError('User not found.', 404);
      }

      user.image = path.join('/upload/', req.files[0].filename);

      user
        .save()
        .then(user => {
          return res.json({ path: user.image });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = app;
