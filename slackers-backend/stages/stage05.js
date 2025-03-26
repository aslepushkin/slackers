/**
 * Created by miavia on 15.09.15.
 *
 * recalculate statistic for each deputat and faction
 * send event "statsDone" or error event "statsError"
 *
 */

var startTime = new Date(),
    config = require('../lib/config'),
    async = require('async'),
    Deputat = require('../models/deputat').Deputat,
    Faction = require('../models/faction').Faction,
    Sess = require('../models/sess').Sess,
    endStage = require('../lib/stageEnd');

module.exports = function() {
    async.waterfall([
        function (next) {
            Deputat.find({}).populate('faction').exec(next);
        },
        function (deputies, next) {
            Sess.find({}, function (err, sessions) {
                next(err, deputies, sessions);
            });
        },
        function (deputies, sessions, next) {
            async.eachSeries(deputies, function (deputat, callback) {
                deputat.updateWork(sessions, callback);
            }, next);
        }
    ], function (err) {
        endStage(err, {
            messageBody: 'statsDone',
            messageError: 'statsError',
            startTime: startTime
        });
    });
};
