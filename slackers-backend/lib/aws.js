/**
 * Created by miavia on 18.09.15.
 */

var config = require('../lib/config'),
    AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: config.get('aws:accessKeyId'),
    secretAccessKey: config.get('aws:secretAccessKey'),
    region: config.get('aws:region'),
    sslEnabled: true
});

module.exports = AWS;