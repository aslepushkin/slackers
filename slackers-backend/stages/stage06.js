/**
 * Created by miavia on 15.09.15.
 *
 * Save cache file
 * send event "cacheDone" or error event "cacheError"
 *
 */

var startTime = new Date(),
    config = require('../lib/config'),
    async = require('async'),
    Deputat = require('../models/deputat').Deputat,
    storage = require('../lib/storage'),
    endStage = require('../lib/stageEnd');

module.exports = function() {
    async.waterfall([
        function (next) {
            //Deputat.find({}).sort({'stats.percents': -1}).populate('faction').select('-work').exec(next);
            Deputat.find({ kod: { $ne: 371 }}).sort({'stats.percents': -1}).populate('faction').select('-work').exec(next);

        },
        function (deputies, next) {
            storage.saveFile(config.get('aws:files:cache'), JSON.stringify(deputies), 'application/json', null, next);
        }
    ], function (err) {
        endStage(err, {
            messageBody: 'cacheDone',
            messageError: 'cacheError',
            startTime: startTime
        });
    });
};
