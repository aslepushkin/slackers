/**
 * Created by miavia on 15.09.15.
 */

var config = require('./config'),
    agent = require('superagent-charset');

var useragents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_0) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.79 Safari/537.4',
    'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Chrome/22.0.1216.0 Safari/537.2',
    'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:15.0) Gecko/20120910144328 Firefox/15.0.2',
    'Mozilla/5.0 (Windows NT 6.1; rv:12.0) Gecko/20120403211507 Firefox/14.0.1',
    'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0',
    'Mozilla/5.0 (Windows; U; MSIE 9.0; Windows NT 9.0; en-US)',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/534.55.3 (KHTML, like Gecko) Version/5.1.3 Safari/534.53.10',
    'Mozilla/5.0 (iPad; CPU OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko ) Version/5.1 Mobile/9B176 Safari/7534.48.3',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/40.0'
];

var getUserAgent = function() {
    return useragents[  Math.floor(Math.random() * useragents.length) ] ;
};

var generateTimeout = function(min, max) {
    return Math.round((min + Math.random() * (max-min))*1000);
};

var getPage = function(url, charset, callback){
    setTimeout(function(){
        agent
            .get(url)
            .accept('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
            .set('Accept-Encoding', 'gzip, deflate')
            .charset(charset)
            .set('Accept-Language', 'uk,en;q=0.7,en-US;q=0.3')
            .set('Cache-Control', 'max-age=0')
            .set('Connection', 'keep-alive')
            .set('DNT', '1')
            .set('User-Agent', getUserAgent())
            .end(function (err, res) {
                if (callback) callback(err, res);
            });
    }, generateTimeout(config.get('grabberTimeoutMin'), config.get('grabberTimeoutMax')));
};

var getImage = function(url, callback){
    setTimeout(function(){
        agent
            .get(url)
            .accept('image/png,image/*;q=0.8,*/*;q=0.5')
            .set('Accept-Encoding', 'gzip, deflate')
            .set('Accept-Language', 'uk,en;q=0.7,en-US;q=0.3')
            .set('Connection', 'keep-alive')
            .set('User-Agent', getUserAgent())
            .set('Referer', '********')
            .end(function (err, res) {
                if (callback) callback(err, res);
            });
    }, generateTimeout(config.get('grabberTimeoutMin'), config.get('grabberTimeoutMax')));
};

module.exports = {
    getPage: getPage,
    getImage: getImage
};


