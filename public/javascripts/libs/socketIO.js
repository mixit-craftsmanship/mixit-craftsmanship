define(['socketIO', 'jquery', 'libs/timer'], function (socketIO, $, timerFactory) {
    var connectionCheckedNbMax = 50;

    var connection;

    var isConnected = function(){
        if(connection === undefined){
            return false;
        }

        return connection.socket.open;
    };

    var createCheckConnectionPromise = function(){
        var deferred = new $.Deferred();

        var checkConnectionNb = 0;
        var checkConnection = function(){
            if(isConnected()){
                checkConnectionTimer.stop();
                deferred.resolve(true);
                return;
            }

            if(checkConnectionNb > connectionCheckedNbMax){
                checkConnectionTimer.stop();
                deferred.reject('Impossible to connect');
                return;
            }

            checkConnectionNb++;
        };

        var checkConnectionTimer = timerFactory.create(100, checkConnection);
        checkConnectionTimer.start();

        return deferred.promise();
    };

    return {
        connect: function(){
            if(isConnected()){
                return;
            }

            if(connection){
                connection.socket.connect();
            }
            else {
                connection = socketIO.connect();
            }

            return createCheckConnectionPromise();
        },
        disconnect: function(){
            if(!isConnected()){
                return;
            }

            connection.disconnect();
        },
        send: function(msgName, data){
            if(!isConnected()){
                throw "Impossible to connect at server";
            }

            connection.emit(msgName, data);
        },
        isConnected: function(){
            return isConnected();
        },
        dispose: function(){
            connection = undefined;
        }
    };
});
