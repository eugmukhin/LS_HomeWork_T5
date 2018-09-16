const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Permission = mongoose.model('permission');
const HttpError = require('../../../libs/error');

app.put('/:permission_id', (req, res, next) => {
  const permissionId = req.params.permission_id;
  Permission.findById(permissionId)
    .then(permission => {
      if (!permission) {
        throw new HttpError('Permission not found.', 404);
      }
      permission
        .set(req.body.permission)
        .save()
        .then(permission => {
          return res.json({ permission: permission });
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = app;
