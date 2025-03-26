/**
 * Created by miavia on 23.09.15.
 */

var startTime = new Date(),
    config = require('./lib/config'),
    logger = require('./lib/logger'),
    http = require('http'),
    stage00 = require('./stages/stage00'),
    orchestrator = require('./lib/orchestrator');

http.createServer(function (req, res) {
    var message;

    req.on('data', function(data) {
        try {
            message = JSON.parse(data.toString());
        } catch(err) {
            logger.log(err);
        }
    });

    req.on('end', function() {
        res.writeHead(200, "OK", {'Content-Type': 'text/plain'});
        res.end();

        switch(req.url){
            case 'start':
            case 'start/':
            case '/start':
            case '/start/':
                stage00();
                break;
            case 'stage01':
            case 'stage01/':
            case '/stage01':
            case '/stage01/':
                stage01();
                break;
            default:
                orchestrator(message);
        }
    });

}).listen(process.env.PORT || config.get('port'));

logger.log('Server running at the port '+config.get('port'));

