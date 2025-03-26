/**
 * Created by miavia on 12.10.15.
 */

var config = require('../lib/config'),
    AWS = require('./aws');

AWS.config.update({
    region: 'us-east-1'
});

var ses = new AWS.SES();


module.exports = function(message, author, callback){
    ses.sendEmail({
        Source: 'kleptons@gmail.com',
        Destination: {
            ToAddresses: ['alexander@slepushkin.com']
        },
        Message: {
            Body: {
              Html: {
                Data: message + '<br/><br/><hr/> Автор:<br/>' + author
              },
              Text: {
                Data: message + '\n\n-------------------------\nАвтор:\n' + author
              }
            },
            Subject: {
              Data: 'Письмо от читателя slackers.elasticbeanstalk.com'
            }
          }
    }, callback);
};
