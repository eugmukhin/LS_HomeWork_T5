const mongoose = require('mongoose');
const config = require('./../config');

mongoose.Promise = global.Promise;
mongoose.connect(
  config.mongodb,
  { useNewUrlParser: true }
);

require('./permission');
require('./user');
require('./news');

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open ${config.mongodb}`);
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected app termination');
    process.exit(0);
  });
});
