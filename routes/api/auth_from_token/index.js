const express = require('express');
const app = express();

app.post('/', (req, res, next) => {
  return res.json(req.user);
});

module.exports = app;
