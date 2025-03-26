/**
 * Created by miavia on 29.09.15.
 */

var config = require('../lib/config'),
    should = require('should');

describe.skip('Deputats', function () {

    var Deputat = require('../models/deputat').Deputat,
        Sess = require('../models/sess').Sess,
        Faction = require('../models/faction').Faction,
        clearDB = require('../lib/emptyDB').removeAll;

    before(function (done){
        //clearDB(done);
    });

    it.skip('Sess.create()', function(done){
        done();
    });

    it.skip('Deputat.createBySession()', function(done){
        this.timeout(60000);
        Deputat.create({
            d_id: "386",
            faction: "Фракція політичної партії \"Всеукраїнське об'єднання \"Батьківщина\" у Верховній Раді України",
            imgSrc: "http://static.rada.gov.ua/dep_img8/but4.jpg",
            name: {
                firstname: "Сергій",
                patronymic: "Владиславович",
                surname: "Соболєв"
            },
            photo: "but4.jpg",
            position: "Член Комітету Верховної Ради України з питань правової політики та правосуддя"
        }, function(err, deputat){
            should.not.exist(err);
            done();
        });
    });



});

describe.skip('Logger', function(){
    var logger = require('../lib/logger'),
        logString = 'Test string for logger';

    it('Logger.log()', function(done){
        logger.log(logString, done);
    });

});

describe('Worker', function(){

    var http = require('http'),
        request = function(body, callback){
            var req = http.request({
                port: 8080,
                path: '/',
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'content-length': body.length,
                    'user-agent': 'aws-sqsd/2.0',
                    'x-aws-sqsd-msgid': '49a75d93-6ca5-425c-8a46-6f54a208ae4f',
                    'x-aws-sqsd-receive-count': '1',
                    'x-aws-sqsd-first-received-at': '2015-10-07T13:39:04Z',
                    'x-aws-sqsd-sent-at': '2015-10-07T13:39:04Z',
                    'x-aws-sqsd-queue': 'slackers',
                    'x-aws-sqsd-path': '',
                    'x-aws-sqsd-sender-id': 'AIDAILCS5RGQHFES42HWE'
                }
            }, function(res){
                res.statusCode.should.equal(200);
                callback();
            });
            req.write(body);
            req.end();
        };

    it.skip('stage 1. fire start', function(done){
        request('{"type":"message","body":"start"}', done);
    });

    it.skip('stage 2', function(done){
        request('{"type":"message","body":"sessionsListProcessed"}', done);
    });

    it.skip('stage 3', function(done){
        request('{"type":"message","body":"sessionsProcessed"}', done);
    });

    it.skip('stage 4', function(done){
        request('{"type":"message","body":"deputiesListProcessed"}', done);
    });

    it.skip('stage 5', function(done){
        request('{"type":"message","body":"deputiesProcessed"}', done);
    });

    it('stage 6', function(done){
        request('{"type":"message","body":"statsDone"}', done);
    });
});