define(['libs/timer', 'libs/socketIO'], function (timerFactory, socketIO) {
    var votes = [];

    var timer;
    var getTimer = function(){
        if(timer === undefined) {
            timer = timerFactory.create(1000, send);
        }

        return timer;
    };

    var send = function(){
        getTimer().stop();
        var votesToSend = votes;
        votes = [];
        for(var key in votesToSend){
            socketIO.send('vote', { talkId: key, votesNb: votesToSend[key] });
        }
    };

    return {
        isEnabled: function(){
            return socketIO.isConnected();
        },
        enable: function(){
            return socketIO.connect();
        },
        disable: function(){
            socketIO.disconnect();
            getTimer().stop();
            votes = [];
        },
        send: function(talkId){
            if(votes[talkId] === undefined) {
                votes[talkId] = 1;
            } else {
                votes[talkId]++;
            }

            getTimer().start();
        },
        onTalkEnded: function(callBack){
            socketIO.on('InvalidTalk', callBack);
        }
    };
});
