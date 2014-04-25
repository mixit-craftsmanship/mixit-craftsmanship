define(['socketIO'], function (socketIO) {
    var socket = socketIO.connect();
    socket.on('news', function (data) {
        console.log(data);
        socket.emit('my other event', { my: 'data' });
    });
    return socket;
});
