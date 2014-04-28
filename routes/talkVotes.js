exports.register = function(socket){
    socket.on('connection', function (socket) {
        socket.on('vote', function (data) {
            console.log(data);
        });
    });
};
