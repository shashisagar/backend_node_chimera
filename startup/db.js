const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://chimeramongodb:URgCaMx227JpMh9cmVMaYpbtPdAw2YQ3vwi7lRZ9fRl3yw6ly2w2Kyy6TqzJY8Lwa25JILISp1DR2WZ56jhPfg%3D%3D@chimeramongodb.documents.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false')
    .then(() => winston.info('Connected to MongoDB...'));
}