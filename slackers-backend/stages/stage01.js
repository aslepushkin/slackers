/**
 * Created by miavia on 15.09.15.
 *
 * Get the page with all sessions and save it to the amazon
 * Generate event "sessionsListProcessed" or error event "sessionsListProcessError"
 *
 */


var startTime = new Date(),
    config = require('../lib/config'),
    getPage = require('../lib/grabber').getPage,
    async = require('async'),
    storage = require('../lib/storage'),
    endStage = require('../lib/stageEnd'),
    filename = config.get('aws:paths:rawdata') + config.get('aws:files:sessions');

module.exports = function() {
    async.waterfall([
        function (next) {
            var currentDate = new Date();
            var endDate = currentDate.getDate() + '.' + (currentDate.getMonth()+1) + '.'+ currentDate.getFullYear();
            var url = config.get('urls:deputatSessionFull')
                .replace('{startDate}', config.get('defaultStartDate'))
                .replace('{endDate}', endDate)
                .replace('{kod}', config.get('defaultDeputatKod'));
            getPage(url, 'windows-1251', next);
        },
        function (response, next) {
            storage.saveFile(filename, response.text, null, false, next);
        }
    ], function (err) {
        endStage(err, {
            messageBody: 'sessionsListProcessed',
            messageError: 'sessionsListProcessError',
            startTime: startTime
        });
    });
};


