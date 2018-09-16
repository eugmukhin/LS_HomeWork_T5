const express = require('express');
const app = express();
const mongoose = require('mongoose');
const HttpError = require('../../../libs/error');
const auth = require('../../../libs/auth');
const User = mongoose.model('user');
const Permission = mongoose.model('permission');

app.post('/', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (user) {
        throw new HttpError('Пользователь с таким логином уже существует', 422);
      } else {
        const newPermission = new Permission();
        newPermission
          .save()
          .then(permission => {
            const newUser = new User();

            newUser.username = req.body.username;
            newUser.firstName = req.body.firstName;
            newUser.surName = req.body.surName;
            newUser.middleName = req.body.middleName;
            newUser.middleName = req.body.middleName;
            newUser.permission = permission;

            newUser
              .setPassword(req.body.password)
              .setAccessToken()
              .save()
              .then(user => {
                auth.setCookie(res, user.access_token);
                return res.json(user);
              })
              .catch(next);
          })
          .catch(next);
      }
    })
    .catch(next);
});

module.exports = app;
