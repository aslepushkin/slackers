var config = require('../lib/config'),
    mongoose = require('../lib/mongoose');

var schema = new mongoose.Schema({
    title: String,
    deputates: {type: Number, default: 0},
    stats: {
        percents: {type: Number, default: 0},
        all: {type: Number, default: 0},
        registered: {type: Number, default: 0}, //"Зареєстрований","Зареєстрована"
        nonregistered: {type: Number, default: 0}, //"Незареєстрований","Незареєстрована"
        hurted: {type: Number, default: 0}, //"Хворіє"
        vacation: {type: Number, default: 0}, // "У відпустці",
        officialjourney: {type: Number, default: 0}, // "У відрядженні",
        forfamilyreasons: {type: Number, default: 0}, //"За сім. обстав."
    }
});

/**
 * Update faction statistics
 * @version 0.1
 * @author klepton
 * @param {String} result - Deputat result
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
    this.stats.percents = this.stats.nonregistered / this.stats.all * 100;
};


/**
 * Return Faction by title or create it (if not found)
 * @version 0.1
 * @author klepton
 * @param {Object} searchString - Search string
 * @param {Function} [callback] - Callback function
 */
schema.statics.getByTitle = function(searchString, callback){
    var Faction = this;
    Faction.findOne({title:searchString}, function(err, faction){
        if(faction){
            callback(null, faction);
        } else {
            (new Faction({title: searchString})).save(function(err, faction){
                callback(err, faction);
            });
        }
    });
};


module.exports.Faction = mongoose.model('Faction', schema);


