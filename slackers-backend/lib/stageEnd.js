/**
 * Created by miavia on 05.10.15.
 */

var config = require('./config'),
    sendMessage = require('./queue').send,
    logger = require('./logger');

/**
 * End of stage
 * @author klepton
 * @param {Error} err - Error || undefined
 * @param {Object} config - Config object
 * @param {String} config.messageBody - Message body
 * @param {String} config.messageError - Message error
 * @param {Date} config.startTime - Start time the execution of script
 */
module.exports = function(err, config){
    var execTime = new Date() - config.startTime;
    var messageBody;
    if(err) {
        logger.log(err);
        messageBody = {
            type: 'error',
            body: config.messageError,
            error: JSON.stringify(err),
            execTime: execTime
        };
    } else {
        messageBody = {
            type: 'message',
            body: config.messageBody,
            execTime: execTime
        };
    }
    sendMessage(JSON.stringify(messageBody), function(err){
        logger.log({
            sendToQueue: err ? 'Error':'Success',
            messageBody: messageBody
        });
    });
};



