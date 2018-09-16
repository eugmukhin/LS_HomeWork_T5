const express = require('express');
const app = express();
const auth = require('../../../libs/auth');
const mongoose = require('mongoose');
const User = mongoose.model('user');

app.get('/', auth.isAuthenticated, (req, res, next) => {
  User.find()
    .populate('permission')
    .exec()
    .then(users => {
      return res.json(users);
    })
    .catch(next);
});

module.exports = app;
