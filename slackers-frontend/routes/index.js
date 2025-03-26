/**
 * Created by miavia on 17.09.15.
 */

var config = require('../lib/config'),
    express = require('express'),
    router = express.Router(),
    sendMessage = require('../lib/sendMessage');

/* GET home page. */
router.get('/', function(req, res, next) {
    var template = 'index';
    if( req.useragent.isMobile || req.useragent.isTablet || req.useragent.isiPad || req.useragent.isiPod || req.useragent.isiPhone || req.useragent.isAndroid || req.useragent.isBlackberry ) {
        template = 'mobile';
    }
    if(config.get('NODE_ENV') === 'development') template = 'index-dev';
    res.render(template);
});

/* GET deputies range. */
router.get('/deputies', function(req, res, next) {
    var limit = parseInt(req.query.limit || 20),
        offset = parseInt(req.query.offset || 0);
    res.json(res.locals.cache.slice(offset, offset+limit));
});

/* GET informer. */
router.get('/slackers.js', function(req, res, next) {
    res.render('informer', function(err, html){
        res.set('Content-Type','application/javascript; charset=utf-8');
        res.send(html);
    });
});

/* POST message. */
router.post('/messages', function(req, res, next) {
    setTimeout(function () {
        sendMessage(req.body.body, req.body.author, function(err, data){
            res.status(200);
            res.send('{"ok":"ok"}');
        });
    }, 2000);
});

module.exports = router;

