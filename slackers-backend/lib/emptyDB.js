/**
 * Created by miavia on 22.12.14.
 */

console.time('Exec time');

var config = require('../lib/config'),
    mongoose = require('../lib/mongoose');

function exit(err, callback){
    console.timeEnd('Exec time');
    if(module.parent) {
        if(callback) callback();
    } else {
        process.exit(err ? 255 : 0);
    }
}

function removeAll(callback) {
    if (config.get('NODE_ENV') === 'production' ) return exit(new Error('Production environment is deprecated for deleting'));
    mongoose.connection.on('open', function(){
        mongoose.connection.db.dropDatabase(function(err){
            if(callback) {
                callback(err);
            } else {
                console.log(err ? err : '\r\nDatabase is empty');
                exit(err, callback);
            }
        });
    });
}


if(module.parent){
    module.exports = {
        removeAll: removeAll
    };
} else {
    removeAll();
}
