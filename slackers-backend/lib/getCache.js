/**
 * Created by miavia on 18.09.15.
 */

var config = require('../lib/config'),
    async = require('async'),
    AWS = require('./aws'),
    s3 = new AWS.S3(),
    cache;

s3.getObject({
    Bucket: config.get('aws:bucket'),
    Key: 'cache.json'
    , ResponseContentEncoding: 'UTF-8'
    , ResponseContentLanguage: 'application/json'
    //, ResponseContentType: 'application/json; charset=utf-8'
    , ResponseContentType: 'application/json'

}, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        cache = JSON.parse(data.Body.toString());
    }
});

module.exports = function(){ return cache; };
