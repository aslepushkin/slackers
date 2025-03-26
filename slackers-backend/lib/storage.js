/**
 * Created by miavia on 23.09.15.
 */
var config = require('./config'),
    AWS = require('./aws'),
    s3 = new AWS.S3();

module.exports = {

    getFile: function(path, callback){
        s3.getObject({
            Bucket: config.get('aws:bucket'),
            Key: path
        }, callback);
    },

    //saveFile: function (path, body, contentType, isPublic, callback){
    saveFile: function (path, body, contentType, isPublic, callback){
        var settings = {
            Bucket: config.get('aws:bucket'),
            Key: path,
            Body: body
        };
        if(isPublic) {
            settings.ACL = 'public-read';
        }
        if(contentType) {
            settings.ContentType = contentType;
        }
        s3.putObject(settings, callback);
    },

    checkFile: function(path, callback){
        s3.headObject({
            Bucket: config.get('aws:bucket'),
            Key: path
        }, function(err, data){
            callback(null, data);
        });
    }

};