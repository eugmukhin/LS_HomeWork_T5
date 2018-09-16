const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UniqueTokenStrategy = require('passport-unique-token').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .populate('permission')
    .exec(function (err, user) {
      done(err, user);
    });
});

// локальная стратегия

passport.use(
  'loginUsers',
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
      .populate('permission')
      .exec()
      .then(user => {
        if (!!user && user.validPassword(password)) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      })
      .catch(err => {
        done(err);
      });
  })
);
