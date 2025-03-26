/**
 * Created by miavia on 15.09.15.
 *
 * Get the page with all sessions and save it to the amazon
 * Generate event "start" or error event "startError"
 *
 */


var startTime = new Date(),
    config = require('../lib/config'),
    endStage = require('../lib/stageEnd');

module.exports = function(){
    endStage(null, {
        messageBody: 'start',
        startTime: startTime
    });
};



