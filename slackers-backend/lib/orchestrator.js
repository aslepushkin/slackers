/**
 * Created by miavia on 08.10.15.
 *
 * stage00: start
 * stage01: sessionsListProcessed | sessionsListProcessError
 * stage02: sessionsProcessed | sessionsProcessedError
 * stage03: deputiesListProcessed | deputiesListProcessError
 * stage04: deputiesProcessed | deputiesProcessError
 * stage05: statsDone | statsError
 * stage06: cacheDone | cacheError
 *
 */
var stage00 = require('../stages/stage00'),
    stage01 = require('../stages/stage01'),
    stage02 = require('../stages/stage02'),
    stage03 = require('../stages/stage03'),
    stage04 = require('../stages/stage04'),
    stage05 = require('../stages/stage05'),
    stage06 = require('../stages/stage06'),
    logger = require('./logger');


module.exports = function(message){
    if(!message || !message.body) {
        return logger.log({
            receivedFromQueue: 'Error',
            messageBody: 'Empty message in request'
        });
    }
    logger.log({
        receivedFromQueue: 'Success',
        messageBody: message
    });
    switch(message.body){
        case 'start':
            stage01();
            break;
        case 'sessionsListProcessed':
            stage02();
            break;
        case 'sessionsListProcessError':
            stage01();
            break;
        case 'sessionsProcessed':
            stage03();
            break;
        case 'sessionsProcessedError':
            stage02();
            break;
        case 'deputiesListProcessed':
            stage04();
            break;
        case 'deputiesListProcessError':
            stage03();
            break;
        case 'deputiesProcessed':
            stage05();
            break;
        case 'deputiesProcessError':
            stage04();
            break;
        case 'statsDone':
            stage06();
            break;
        case 'statsError':
            stage05();
            break;
        case 'cacheDone':
            break;
        case 'cacheError':
            stage06();
            break;
        default:
            logger.log({
                type: 'error',
                body: 'Orchestrator error. Unknown stage',
                error: message
            });
    }
};

