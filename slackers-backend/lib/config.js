var nconf = require('nconf'),
    path = require('path');

nconf.argv().env();
var localEnv = nconf.get('NODE_ENV') || 'development';
nconf.file('global', { file: path.join(__dirname, '../config-' + localEnv + '.json') });

module.exports = nconf;
