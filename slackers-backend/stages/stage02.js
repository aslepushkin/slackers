/**
 * Created by miavia on 15.09.15.
 *
 *  Check new sessions and download its file and save it to the amazon
 *  If we will have new sessions we would send the event "sessionsProcessed" or error event "sessionsProcessError"
 *
 */

var startTime = new Date(),
    config = require('../lib/config'),
    async = require('async'),
    Sess =require('../models/sess').Sess,
    storage = require('../lib/storage'),
    endStage = require('../lib/stageEnd'),
    parser = require('../lib/parser');

module.exports = function() {
    async.waterfall([
        //1. get last saved session model
        function (next) {
            Sess.find({}).limit(1).sort({plenaryNumber: -1}).exec(next);
        },
        //2. open file from s3
        function (sessions, next) {
            var lastSessionNumber = sessions.length ? sessions[0].get('plenaryNumber') : 0;
            storage.getFile(config.get('aws:paths:rawdata') + config.get('aws:files:sessions'), function (err, data) {
                next(err, data, lastSessionNumber);
            });
        },
        //3. parse file data --> array of new session with url
        function (data, lastSessionNumber, next) {
            parser.parseSessionList(data.Body.toString(), lastSessionNumber, next);
        },
        //4. for every new session
        function (sessions, next) {
            async.eachSeries(sessions, function (sessionRaw, callback) {
                Sess.create(sessionRaw, callback);
            }, function (err) {
                next(err, sessions);
            });
        }
    ], function (err) {
        endStage(err, {
            messageBody: 'sessionsProcessed',
            messageError: 'sessionsProcessError',
            startTime: startTime
        });
    });
};







