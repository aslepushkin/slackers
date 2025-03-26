/**
 * Created by alexander@slepushkin.com on 05.10.15.
 */


var App = (function(){
    var instance,
        offset = 20,
        limit = 20,
        messageDialog,
        messageSendBtn,
        messageBody,
        messageAuthor,
        sendStages = [
            ' ',
            ' ',
            'Аккуратно сворачиваем письмо...',
            'Кладем его в конверт...',
            'Запечатываем конверт...',
            'Клеим марку...',
            'Бросаем в почтовый ящик...',
            'Ждем ответа...',
            'Еще ждем ответа...',
            'Я вам пока анекдот расскажу...',
            'Пишет ребенок письмо Деду Морозу...',
            'Дорогой дедушка - пришла зима...',
            'Ну раз вы этот знаете...',
            'Попробую другой рассказать...'
        ],
        sendStage,
        sendStageTimeOut = 3000;

    $.blockUI.defaults.css.border = 'none';
    $.blockUI.defaults.css.backgroundColor = '';
    $.blockUI.defaults.css.color = 'white';
    $.blockUI.defaults.css.fontSize = '1.5em';


    var changeBlockerText = function(text){
        $('div.blockUI.blockMsg').text(text);
    };

    var sendingProccess = function(){
        if( sendStage === sendStages.length ) {
            return;
        } else {
            changeBlockerText(sendStages[sendStage]);
            sendStage++;
            setTimeout(sendingProccess, sendStageTimeOut);
        }
    };

    var allowLoad = function(){
        $(window).bind('scroll',function(){
            if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                $(window).unbind('scroll');
                getNextPage();
            }
        });
    };

    var renderDeputies = function(deputies){
        var domInsert = '';
        for(var i=0; i<deputies.length; i++){
            var deputat = deputies[i];
            domInsert += '<li class="deputat">' +
                '<img src="' + photoPath + deputat.photo + '"/>' +
                '<div class="fio">' + deputat.name.surname + ' ' + deputat.name.firstname + ' ' + deputat.name.patronymic + ' (<a href="http://w1.c1.rada.gov.ua/pls/radan_gs09/ns_dep?vid=3&kod=' + deputat.kod + '" target="_blank">Пруфлинк</a>)</div>' +
                '<div class="faction">' + deputat.faction.title + '</div>' +
                '<div class="percents">' + deputat.stats.percents + '<span>&nbsp;% (' + deputat.stats.nonregistered + ' из ' + deputat.stats.all + ')</span></div>' +
                '</li>';
        }
        $('#slackersContainer').append(domInsert);
        if(deputies && deputies.length) allowLoad();
    };

    var getNextPage = function(){
        $.ajax('/deputies?offset='+offset+'&limit='+limit, {
            method: 'GET',
            headers: {'X-Requested-With': 'XMLHttpRequest'}
        }).done(function(data, textStatus, jqXHR){
            renderDeputies(data);
            offset += limit;
        }).fail(function(jqXHR, textStatus, errorThrown){
            console.log(textStatus + ' : ' + errorThrown);
        });
    };

    var initMessageWin = function(){
        $(messageSendBtn).attr('disabled', true);
        $(messageBody).val('');
    };

    var sendMessage = function(){
        sendStage = 0;
        $(messageDialog).block({message: '&nbsp;'});
        sendingProccess();
        if($(messageBody).val() <= 3) return alert('Error');
        $.ajax('/messages', {
            method: 'POST',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            data: {
                author: $(messageAuthor).val(),
                body: $(messageBody).val()
            },
            dataType: 'json'
        }).done(function(data, textStatus, jqXHR){
            sendStage = sendStages.length;
            changeBlockerText('Отлично! Письмо ушло адресату');
            setTimeout(function() {
                $(messageDialog).modal('hide');
            }, 2000);
        }).fail(function(jqXHR, textStatus, errorThrown){
            sendStage = sendStages.length;
            changeBlockerText('Почта вернула письмо. Это какая-то ошибка. Попробуйте отправить позднее.');
        }).always(function(){
            setTimeout(function() {
                $(messageDialog).unblock();
            }, 2000);
        });
    };

    var createInstance = function() {
        return {
            init: function(){
                messageDialog = $('#messWin');
                messageSendBtn = $('#messSendBtn');
                messageBody = $('#messBody');
                messageAuthor = $('#messNick');
                $(messageDialog).on('show.bs.modal', initMessageWin);
                $(messageSendBtn).on('click', sendMessage);
                $(messageBody).on('input', function(){
                    var isDisabled = !($(messageBody).val().length > 3);
                    $(messageSendBtn).attr('disabled', isDisabled);
                });
                allowLoad();
            }
        };
    };

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

var ap = App.getInstance();
$(document).ready(ap.init);
