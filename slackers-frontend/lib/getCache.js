/**
 * Created by miavia on 18.09.15.
 */

var config = require('../lib/config'),
    AWS = require('./aws'),
    cache;

AWS.config.update({
    region: config.get('aws:region')
});

var s3 = new AWS.S3();

s3.getObject({
    Bucket: config.get('aws:bucket'),
    Key: config.get('aws:files:cache')
}, function(err, data) {
    if (err) {
        console.log(err, err.stack);
    } else {
        cache = JSON.parse(data.Body.toString());
    }
});

module.exports = function(){ return cache; };
