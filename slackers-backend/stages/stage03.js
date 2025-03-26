/**
 * Created by miavia on 15.09.15.
 *
 * if are there new sessions we will check new deputies to save them
 * send event "deputiesListProcessed" or error event "deputiesListProcessError"
 *
 */

var startTime = new Date(),
    config = require('../lib/config'),
    async = require('async'),
    getPage = require('../lib/grabber').getPage,
    storage = require('../lib/storage'),
    endStage = require('../lib/stageEnd'),
    filename = config.get('aws:paths:rawdata') + config.get('aws:files:deputies');

module.exports = function() {
    async.waterfall([
        function (next) {
            getPage(config.get('urls:deputiesList'), 'windows-1251', next);
        },
        function (response, next) {
            storage.saveFile(filename, response.text, null, false, next);
        }
    ], function (err, response) {
        endStage(err, {
            messageBody: 'deputiesListProcessed',
            messageError: 'deputiesListProcessError',
            startTime: startTime
        });
    });
};






