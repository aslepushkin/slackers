/**
 * Session Model
 * @version 0.1
 * @author klepton
 */

var config = require('../lib/config'),
    async = require('async'),
    mongoose = require('../lib/mongoose'),
    getPage = require('../lib/grabber').getPage,
    storage = require('../lib/storage'),
    parser = require('../lib/parser');

var schema = new mongoose.Schema({
    plenaryNumber: {
        type: Number,
        unique: true,
        required: true
    },
    session: String,
    date: Date,
    dateRaw: String,
    urlId: String,
    plenaryType: {
        type: String,
        enum: [
            'Ранкове засідання',
            'Вечірнє засідання'
        ]
    },
    result: [{
        kod: Number,
        result: String
    }]
});

/**
 * Get result by deputat kod
 * @version 0.1
 * @author klepton
 * @param {Number} kod - Deputats kod
 * @param {Function} [callback] - Callback function
 */
schema.methods.getResultByKod = function(kod){
    for (var i = this.result.length-1; i >= 0; i--) {
        var value = this.result[i];
        if (value.kod == kod) {
            return value.result;
        }
    }
    return undefined;
};

/**
 * Create new session
 * @version 0.1
 * @author klepton
 * @param {Object} rawData - Raw data of new session
 * @param {Number} rawData.plenaryNumber - Session number
 * @param {String} rawData.session - Title of session
 * @param {Date}   rawData.date - Session Date
 * @param {String} rawData.dateRaw - Original Date string
 * @param {String} rawData.urlId - Website id
 * @param {String} rawData.plenaryType - Type of plenary
 * @param {Function} [callback] - Callback function
 */
schema.statics.create = function(rawData, callback){
    var session = new this(rawData);
    var fileName = config.get('aws:paths:rawdata') + config.get('aws:paths:sessions')+ session.get('plenaryNumber') + '.html';
    async.waterfall([
        function(next){
            storage.getFile(fileName, function(err, data){
                if(err) {
                    next(null, null);
                } else {
                    next(null, data);
                }
            });
        },
        function(data, next){
            if(data) {
                next(null, data.Body);
            } else {
                getPage(config.get('urls:sessionFull').replace('{urlId}', session.get('urlId')), 'windows-1251', function(err, res){
                    if(err) return next(err);
                    storage.saveFile(fileName, res.text, null, false, function(err, data){
                        next(err, res.text);
                    });
                });
            }
        },
        function(html, next){
            parser.parseSession(html.toString(), next);
        },
        function(results, next){
            session.result = results;
            session.save(next);
        }
    ], callback);
};

module.exports.Sess = mongoose.model('Sess', schema);


