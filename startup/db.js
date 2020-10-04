const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://localhost/chimera_chat')
    .then(() => winston.info('Connected to MongoDB...'));
}