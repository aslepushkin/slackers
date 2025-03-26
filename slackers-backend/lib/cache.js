console.time('Exec time');

var async = require('async'),
    fs = require('fs'),
    Deputat = require('../models/deputat').Deputat,
    Sess = require('../models/sess').Sess,
    Faction = require('../models/faction').Faction;

var create = function(callback) {
    var result = {
        slackers: [],
        workaholics: [],
        factions: []
    };

    var sessions;

    async.series([
        function(callback){
            Sess.count({}, function(err, count){
                if(err) return callback(err);
                sessions = count;
                callback();
            });
        },
        function(callback){
            Deputat.find({}).sort({'stats.nonregistered': -1}).populate('faction').exec(function(err, deputats){
                if(err) return callback(err);
                for(var i = deputats.length-1; i >= 0; i--){
                    var dep = deputats[i];
                    dep.percents = (parseInt(dep.get('stats').nonregistered)/dep.work.length * 100).toFixed(2);
                }
                result.slackers = deputats;
                callback();
            });
        },
        function(callback){
            Deputat.find({}).sort('stats.nonregistered').limit(20).exec(function(err, deputats){
                if(err) return callback(err);
                for(var i = deputats.length-1; i >= 0; i--){
                    var dep = deputats[i];
                    dep.percents = (parseInt(dep.get('stats').nonregistered)/dep.work.length * 100).toFixed(2);
                }
                result.workaholics = deputats;
                callback();
            });
        },
        function(callback){
            Faction.find({}, function(err, factions){
                if(err) return callback(err);
                for(var i = factions.length-1; i >= 0; i--){
                    var faction = factions[i];
                    var totalValue = sessions * faction.get('deputates');
                    faction.percents = (parseInt(faction.get('stats').nonregistered)/totalValue * 100).toFixed(2);
                }
                factions.sort(function(a, b){
                    if (a.percents > b.percents)
                        return -1;
                    if (a.percents < b.percents)
                        return 1;
                    return 0;
                });

                result.factions = factions;
                callback();
            });
        }
    ], function(err){
        result.sessions = sessions;
        if(callback) callback(result);
    });

};

var createAndSave = function(path) {
    create(function(result){
        fs.writeFileSync(path || '../data/cache.json', JSON.stringify(result));
        exit();
    });
};

function exit(err, callback){
    console.timeEnd('Exec time');
    if(module.parent) {
        if(callback) callback();
    } else {
        process.exit(err ? 1 : 0);
    }
}

if(module.parent){
    module.exports = createAndSave;
} else {
    createAndSave();
}

