const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const HttpError = require('../../../libs/error');

app.put('/:user_id', (req, res, next) => {
  const userId = req.params.user_id;

  if (!req.user._id.equals(userId)) {
    throw new HttpError('Доступ закрыт', 403);
  }

  User.findById(userId)
    .populate('permission')
    .exec()
    .then(user => {
      if (!user) {
        throw new HttpError('User not found.', 404);
      }

      user.firstName = req.body.firstName || user.firstName;
      user.surName = req.body.surName || user.surName;
      user.middleName = req.body.middleName || user.middleName;

      if (req.body.oldPassword && !user.validPassword(req.body.oldPassword)) {
        throw new HttpError('Not valid password.', 400);
      } else if (req.body.oldPassword && user.validPassword(req.body.oldPassword)) {
        user.setPassword(req.body.password);
      }

      user
        .save()
        .then(user => {
          return res.json(user);
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = app;
