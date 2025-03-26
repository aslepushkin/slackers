/**
 * Created by miavia on 15.09.15.
 *
 * if are there new sessions we will check new deputies to save them
 * send event "deputiesProcessed" or error event "deputiesProcessError"
 *
 */

var startTime = new Date(),
    config = require('../lib/config'),
    async = require('async'),
    Deputat = require('../models/deputat').Deputat,
    Faction = require('../models/faction').Faction,
    storage = require('../lib/storage'),
    endStage = require('../lib/stageEnd'),
    getPage = require('../lib/grabber').getPage,
    parser = require('../lib/parser'),
    deputiesFile = config.get('aws:paths:rawdata') + config.get('aws:files:deputies');

module.exports = function() {
    async.waterfall([
        // 1. Get file with all deputies and parse it
        function (next) {
            storage.getFile(deputiesFile, next);
        },
        function (data, next) {
            parser.parseDeputiesList(data.Body.toString(), next);
        },
        // 2. Get all deputies from DB
        function (newDeputies, next) {
            Deputat.find({}, function (err, oldDeputies) {
                next(err, oldDeputies, newDeputies);
            });
        },
        // 3. Process odl deputioes
        function (oldDeputies, newDeputies, next) {
            //async.each(oldDeputies, function(deputat, callback){
            async.eachSeries(oldDeputies, function (deputat, callback) {
                if (newDeputies[deputat.get('d_id')]) {
                    deputat.active = true;
                    async.waterfall([
                        function (next) {
                            Faction.getByTitle(newDeputies[deputat.get('d_id')].faction, next);
                        },
                        function (faction, next) {
                            deputat.faction = faction.get('_id');
                            deputat.save(next);
                        }
                    ], function (err) {
                        delete newDeputies[deputat.get('d_id')];
                        callback(err);
                    });
                } else { // deputat left Parliament
                    deputat.active = false;
                    deputat.save(callback);
                }

            }, function (err) {
                next(err, newDeputies);
            });
        },
        // 4. Process new deputies
        function (newDeputies, next) {
            async.eachSeries(newDeputies, function (deputat, callback) {
                Deputat.create(deputat, callback);
            }, next);
        }
    ], function (err, response) {
        endStage(err, {
            messageBody: 'deputiesProcessed',
            messageError: 'deputiesProcessError',
            startTime: startTime
        });
    });
};







