/**
 * Created by miavia on 08.10.15.
 */


var fs = require('fs'),
    config = require('./config'),
    Log = require('../models/log').Log;

module.exports = {

    /**
     * Save log to mongo or file
     * @version 0.1
     * @author klepton
     * @param {String|Object} body - String or Object for log
     * @param {Function} [callback] - Callback function
     */
    log: function(body, callback){
        callback = callback || function(){};
        if(!body) return callback();
        console.log(body);
        switch(typeof body){
            case 'object':
                body = JSON.stringify(body);
                break;
            case 'string':
                break;
            default:
                body = body.toString();
        }
        (new Log({body: body})).save(callback);
    }

};