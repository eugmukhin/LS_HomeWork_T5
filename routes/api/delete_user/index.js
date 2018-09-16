const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const HttpError = require('../../../libs/error');

app.delete('/:user_id', (req, res, next) => {
  const userId = req.params.user_id;
  User.findByIdAndRemove(userId)
    .exec()
    .then(user => {
      if (!user) {
        throw new HttpError('User not found.', 404);
      } else {
        return res.json({ status: 'OK' });
      }
    })
    .catch(next);
});

module.exports = app;
