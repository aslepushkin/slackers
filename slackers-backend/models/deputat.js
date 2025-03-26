/**
 * Deputat Model
 * @version 0.1
 * @author klepton
 */

var config = require('../lib/config'),
    async = require('async'),
    mongoose = require('../lib/mongoose'),
    grabber = require('../lib/grabber'),
    parser = require('../lib/parser'),
    storage = require('../lib/storage'),
    Faction = require('../models/faction').Faction;

var schema = new mongoose.Schema({
    name: {
        firstname: {type: String, required: true},
        patronymic: {type: String},
        surname: {type: String, required: true}
    },
    photo: String,
    d_id: {
        type: Number,
        unique: true,
        required: true
    },
    kod: {
        type: Number,
        unique: true,
        required: true
    },
    faction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faction'
    },
    position: String,
    active: {type: Boolean, default: true},
    stats: {
        percents: {type: Number, default: 0},
        all: {type: Number, default: 0},
        registered: {type: Number, default: 0}, //"Зареєстрований","Зареєстрована"
        nonregistered: {type: Number, default: 0}, //"Незареєстрований","Незареєстрована"
        hurted: {type: Number, default: 0}, //"Хворіє"
        vacation: {type: Number, default: 0}, // "У відпустці",
        officialjourney: {type: Number, default: 0}, // "У відрядженні",
        forfamilyreasons: {type: Number, default: 0}, //"За сім. обстав."
        othergoodreasons: {type: Number, default: 0} //"З інших поважних"
    },
    work: [{
        sess: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sess',
            unique: true,
            required: true
        },
        //faction: {
        //    type: mongoose.Schema.Types.ObjectId,
        //    ref: 'Faction'
        //},
        status: {
            type: String,
            enum: [
                "Зареєстрований",
                "Незареєстрований",
                "Хворіє",
                "Зареєстрована",
                "Незареєстрована",
                "У відпустці",
                "У відрядженні",
                "За сім. обстав.",
                "З інших поважних"
            ]
        }
    }]
});

/**
 * Update detutats register data
 * @author klepton
 * @param {String} result - Deputat result
 * @param {Function} [callback] - Callback function
 */
schema.methods.updateStats = function(result){
    this.stats.all++;
    switch(result){
        case 'Зареєстрований':
        case 'Зареєстрована':
            this.stats.registered++;
            break;
        case 'Незареєстрований':
        case 'Незареєстрована':
            this.stats.nonregistered++;
            break;
        case 'Хворіє':
            this.stats.hurted++;
            break;
        case 'У відпустці':
            this.stats.vacation++;
            break;
        case 'У відрядженні':
            this.stats.officialjourney++;
            break;
        case 'За сім. обстав.':
            this.stats.forfamilyreasons++;
            break;
        case 'З інших поважних':
            this.stats.othergoodreasons++;
            break;
    }
    this.stats.percents = (this.stats.nonregistered / this.stats.all * 100).toFixed(2);
};


/**
 * Link session to deputat
 * @author klepton
 * @param {Array} sessions - Array of session models
 * @param {Function} [callback] - Callback function
 */
schema.methods.updateWork = function(sessions, callback){
    var deputat = this;
    async.eachSeries(sessions, function(session, callback){
        var result = session.getResultByKod(deputat.get('kod'));
        if(!result || deputat.getSessionById(session.get('_id'))) return callback();
        deputat.work.push({
            sess: session.get('_id'),
            //faction: deputat.get('faction'),
            status: result
        });
        deputat.updateStats(result);
        //deputat.get('faction').updateStats(result);
        callback();
    }, function(err){
        deputat.save(callback);
        //faction save
    });
};


/**
 * Get the deputat session by session id
 * @author klepton
 * @param {Object} sessionId - Session ObjectId()
 * @param {Function} [callback] - Callback function
 */
schema.methods.getSessionById = function(sessionId){
    for (var i = this.work.length-1; i >= 0; i--) {
        var value = this.work[i];
        if (value.get('sess').toString() === sessionId.toString()) {
            return value.sess;
        }
    }
    return undefined;
};

/**
 * Create new deputat
 * @author klepton
 * @param {Object} rawData - Raw data of new deputat
 * @param {String} rawData.imgSrc - Http address for deputats photo
 * @param {String} rawData.photo - File name for deputats photo
 * @param {Number} rawData.d_id - Deputat id from Parliament website
 * @param {String} rawData.faction - Deputat faction title
 * @param {String} rawData.position - Deputat position
 * @param {Object} rawData.name - Full name of deputat
 * @param {String} rawData.name.firstname - Firstname
 * @param {String} rawData.name.patronymic - Patronymic
 * @param {String} rawData.name.surname - Surname
 * @param {Function} [callback] - Callback function
 */
schema.statics.create = function(rawData, callback){
    var Deputat = this;
    async.waterfall([
        //1. Process photo
        function(next){
            grabber.getImage(rawData.imgSrc, next);
        },
        function(res, next){
            storage.saveFile(config.get('aws:paths:photos') + rawData.photo, res.body, res.type, 'public-read', next);
        },
        //2. process faction (create if will no found)
        function(meta, next){
            Faction.getByTitle(rawData.faction, next);
        },
        function(faction, next){
            rawData.faction = faction.get('_id');
            next();
        },
        //3. Process kod
        function(next){
            grabber.getPage(config.get('urls:deputatPage').replace('{d_id}', rawData.d_id), 'utf-8', next);
        },
        function(res, next){
            parser.parseDeputatPage(res.text, next);
        },
        function(res, next){
            rawData.kod = res.kod;
            (new Deputat(rawData)).save(next);
        }
    ], callback);
};

module.exports.Deputat = mongoose.model('Deputat', schema);


