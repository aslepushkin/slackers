/**
 * Created by miavia on 15.09.15.
 */

var config = require('./config'),
    utils = require('./utils'),
    jsdom = require('jsdom');

/**
 * Parse html page
 * @version 0.1
 * @author klepton
 * @param {String} html - Raw html text
 * @param {Function} parseLogic - Function that included parsing logic
 */
var parse = function(html, parseLogic){
    jsdom.env(
        html,
        ['http://code.jquery.com/jquery-2.1.4.min.js'],
        function(err, window){
            parseLogic(err, window.$);
        }
    );
};


module.exports = {

    parseDeputatPrint: function(html, callback){
        parse(html.replace('<center>','').replace('</center>'), function(err, $){
            if(err) return callback(err);
            var fio = $('td.f2>b').html().toLowerCase().split(' ');
            fio.forEach(function(currentValue, index, array){ array[index] = currentValue.capitalize(); });
            //var sessions = $('td.f2>b').html().toLowerCase().split(' ');
            callback(null, {
                firstname: fio[1],
                patronymic: fio[2],
                surname: fio[0]
            });
        });
    },

    parseDeputatSearchResult: function(html, callback){
        parse(html.replace('<center>','').replace('</center>'), function(err, $){
            if(err) return callback(err);
            callback(null, {
                d_id: $('p.title').html().replace(/\n(.*)page\/(\d*)(.*)\n/g, '$2'),
                imgSrc: $('p.thumbnail>img').attr('src')
            });
        });

    },

    parseDeputiesList: function(html, callback){
        parse(html, function(err, $){
            if(err) return callback(err);
            var deputiesRaw = $('li');
            var deputies = {};
            for(var i = deputiesRaw.length-1; i >= 0; i--) {
                var html = $(deputiesRaw[i]).html().replace(/\n/g, '').replace(/[\s]+/g, ' ');
                var imgSrc = html.replace(/(.*)<img width="80px" src="([^"]*)">(.*)/, '$2'),
                    photo = imgSrc.split('/'),
                    fio = html.replace(/(.*)target="_blank">([^<]*)<\/a>(.*)/, '$2').split(' '),
                    dId = html.replace(/(.*)<a href="http:\/\/itd.rada.gov.ua\/mps\/info\/page\/(\d*)(.*)/, '$2');
                deputies[dId] = {
                    imgSrc: imgSrc,
                    photo: photo[photo.length-1],
                    d_id: dId,
                    name: {
                        firstname: fio[1],
                        patronymic: fio[2],
                        surname: fio[0]
                    },
                    faction: html.replace(/(.*)<dt>Фракція<\/dt><dt><\/dt><dd>([^<]*)<\/dd>(.*)/, '$2')
                        .replace('Член депутатської фракції', 'Фракція')
                        .replace('Заступник голови депутатської фракції', 'Фракція')
                        .replace('Голова депутатської фракції', 'Фракція')
                        .replace('Перший заступник Голови депутатської фракції', 'Фракція')
                        .replace('Заступник голови депутатської групи', 'Депутатська група')
                        .replace('Співголова депутатської групи групи', 'Депутатська група')
                        .replace('Співголова депутатської групи', 'Депутатська група')
                        .replace('Член депутатської групи', 'Депутатська група'),
                    position: html.replace(/(.*)<dt>Посада<\/dt><dt><\/dt><dd>([^<]*)<\/dd>(.*)/, '$2')
                };
            }
            callback(null, deputies);
        });

    },

    parseDeputatPage: function(html, callback){
        parse(html, function(err, $){
            if(err) return callback(err);
            var htmlRaw = $('div.topTitle')[0];
            htmlRaw = $(htmlRaw).html().replace(/\n/g, '').replace(/[\s]+/g, ' ');
            callback(null, {
                kod: htmlRaw.replace(/(.*)pls\/radan_gs09\/ns_dep\?vid=1&amp;kod=(\d+)"(.*)/, '$2')
            });
        });
    },

    parseSessionList: function(html, lastSessionNumber, callback){
        parse(html, function(err, $){
            if(err) return callback(err);
            var newSessionsRaw = $('div.block_pd').slice(lastSessionNumber);
            var newSessions = [];
            newSessionsRaw.each(function(){
                var sessionRaw = $(this).children(),
                    plenaryNumber = parseInt($(sessionRaw[0]).text()),
                    session = $(sessionRaw[1]).text(),
                    dateRaw = $(sessionRaw[2]).text(),
                    date = new Date(
                        dateRaw.substr(3, 2) + '/' +
                        dateRaw.substr(0, 2) + '/' +
                        dateRaw.substr(6)
                    ),
                    urlId = $(sessionRaw[3]).html()
                        .replace('target="_blank" ', '')
                        .replace('\n<a href="/pls/radan_gs09/ns_reg_write?g_id=', '')
                        .replace('" target="_blank">\nРанкове засідання\n</a>', '')
                        .replace('" target="_blank">\nВечірнє засідання\n</a>', ''),
                    plenaryType = $(sessionRaw[3]).text().replace(/\n/g, '');

                newSessions.push({
                    plenaryNumber: plenaryNumber,
                    session: session,
                    date: date,
                    dateRaw: dateRaw,
                    urlId: urlId,
                    plenaryType: plenaryType
                });
            });

            callback(null, newSessions);
        });
    },

    parseSession: function(htmlRaw, callback){
        parse(htmlRaw, function(err, $){
            if(err) return callback(err);
            var resultRaw = $('li#00 ul.frd>li');
            var result = [];
            for(var i = resultRaw.length-1; i>=0; i--){
                result.push({
                    kod: resultRaw[i].id.replace('0idd',''),
                    result: $(resultRaw[i].children[1].children[0]).text()
                });
            }
            callback(null, result);
        });
    }



};


