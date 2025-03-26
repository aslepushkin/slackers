var config = require('../lib/config'),
    mongoose = require('../lib/mongoose'),
    fs = require('fs');

var schema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    body: String
});

module.exports.Log = mongoose.model('Log', schema);


