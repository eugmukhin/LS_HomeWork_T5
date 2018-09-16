const mongoose = require('mongoose');
const User = mongoose.model('user');
const HttpError = require('./error');

module.exports.setCookie = (res, data) => {
  res.cookie('access_token', data, {
    expires: new Date(Date.now() + 2 * 604800000),
    path: '/'
  });
};

module.exports.isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    throw new HttpError('Доступ закрыт', 403);
  }
};

module.exports.isAuthorized = function (group, operation) {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.checkAccess(group, operation)) {
      return next();
    } else {
      throw new HttpError('Доступ закрыт', 403);
    }
  };
};

module.exports.authByToken = function (req, res, next) {
  if (req.body.access_token || !req.isAuthenticated()) {
    User.findOne({ access_token: req.body.access_token })
      .populate('permission')
      .exec()
      .then(user => {
        if (user) {
          req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }
            return next();
          });
        } else {
          res.clearCookie('access_token');
          req.logout();
          return next();
        }
      })
      .catch(next);
  } else {
    next();
  }
};
