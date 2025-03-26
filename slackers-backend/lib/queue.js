/**
 * Created by miavia on 23.09.15.
 */
var config = require('./config'),
    AWS = require('./aws'),
    sqs = new AWS.SQS();

module.exports = {
    send: function(MessageBody, callback){
        sqs.sendMessage({
            MessageBody: MessageBody,
            QueueUrl: config.get('aws:queueUrl')
        }, callback);
    }
};