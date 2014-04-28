define(['socketIO'], function (socketIO) {
    var connection;

    var isConnected = function(){
        if(connection === undefined){
            return false;
        }

        return connection.socket.open;
    };

    return {
        connect: function(){
            if(isConnected()){
                return;
            }

            connection = socketIO.connect();
        },
        disconnect: function(){
            if(!isConnected()){
                return;
            }

            connection.disconnect();
            connection = undefined;
        },
        send: function(msgName, data){
            if(!isConnected()){
                throw "Impossible to connect at server";
            }

            connection.emit(msgName, data);
        },
        isConnected: function(){
            return isConnected();
        }
    };
});
