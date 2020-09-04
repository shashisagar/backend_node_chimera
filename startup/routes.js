const express = require('express');
var cors = require('cors')
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use(cors());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}