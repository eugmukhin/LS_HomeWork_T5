const express = require('express');
const app = express();
const passport = require('passport');
const auth = require('../../../libs/auth');
const HttpError = require('../../../libs/error');

app.post('/', (req, res, next) => {
  passport.authenticate('loginUsers', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      throw new HttpError('Not valid password.', 400);
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      if (req.body.remembered) {
        user
          .setAccessToken()
          .save()
          .then(user => {
            auth.setCookie(res, user.access_token);
            return res.json(user);
          })
          .catch(next);
      } else {
        return res.json(user);
      }
    });
  })(req, res, next);
});

module.exports = app;
