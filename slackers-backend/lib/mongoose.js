var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.get('db:uri'), config.get('db:options'));

module.exports = mongoose;