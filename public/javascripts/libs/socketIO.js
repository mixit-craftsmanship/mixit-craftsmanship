define(['socketIO', 'libs/timer'], function (socketIO, timerFactory) {
    var connectionCheckedNbMax = 50;

    var connection;
    var isConnected = function(){
        if(connection === undefined){
            return false;
        }

        return connection.socket.open;
    };

    var createCheckConnectionPromise = function(){
        var doneCallbacks = [];
        var failCallbacks = [];

        var isFailed = false;
        var isSuccessed = false;
        var isFinished = false;

        var resolve = function(){
            isSuccessed = true;
            isFinished = true;

            doneCallbacks.forEach(function(callback) {
                callback();
            });
        };

        var reject = function(){
            isFailed = true;
            isFinished = true;

            failCallbacks.forEach(function(callback) {
                callback();
            });
        };

        var checkConnectionNb = 0;
        var checkConnection = function(){
            if(isConnected()){
                checkConnectionTimer.stop();
                resolve(true);
                return;
            }

            if(checkConnectionNb > connectionCheckedNbMax){
                checkConnectionTimer.stop();
                reject('Impossible to connect');
                return;
            }

            checkConnectionNb++;
        };

        var checkConnectionTimer = timerFactory.create(100, checkConnection);
        checkConnectionTimer.start();

        return new function(){
            this.done = function(doneCallback){
                if(!isFinished){
                    doneCallbacks.push(doneCallback);
                } else if(isSuccessed) {
                    doneCallback();
                }

                return this;
            };

            this.fail = function(failCallback){

                if(!isFinished){
                    failCallbacks.push(failCallback);
                } else if(isFailed) {
                    failCallback();
                }

                return this;
            };
        };
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
        on: function(msgName, callBack){
            connection.on(msgName, callBack);
        },
        isConnected: function(){
            return isConnected();
        },
        dispose: function(){
            connection = undefined;
        }
    };
});
