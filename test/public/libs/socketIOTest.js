define(['libs/socketIO', 'socketIO'], function(socketIOWrapper, socketIO) {
    describe('SocketIO module', function () {
        var oldConnect = socketIO.connect;
        after(function(){
            socketIO.connect = oldConnect;
        });

        before(function(){
            socketIO.connect = function(){};
        });

        var connectionConnected = {
            socket: {
                open: true
            },
            disconnect: function() {}
        };

        var connectionNotConnected = {
            socket: {
                open: false
            },
            disconnect: function() {}
        };

        beforeEach(function(){
            socketIOWrapper.dispose();
        });

        it('when connect Then connect socketIO', function () {
            var called = false;
            socketIO.connect = function(){
                called = true;
            };

            socketIOWrapper.connect();

            called.should.be.true;
        });

        it('Given already connected when connect Then not reconnect socketIO', function () {
            socketIO.connect = function(){
                return connectionConnected;
            };
            socketIOWrapper.connect();
            var called = false;
            socketIO.connect = function(){
                called = true;
            };

            socketIOWrapper.connect();

            called.should.be.false;
        });

        it('Given already call connect but not connected when connect Then reconnect socketIO', function () {
            var connection = {
                socket: {
                    open: true
                },
                disconnect: function() {}
            };
            socketIO.connect = function(){
                return connection;
            };
            socketIOWrapper.connect();
            var called = false;
            connection.socket.open = false;
            connection.socket.connect = function(){
                called = true;
            };

            socketIOWrapper.connect();

            called.should.be.true;
        });

        it('Given not connection then isConnected is false', function () {
            socketIOWrapper.isConnected().should.be.false;
        });

        it('Given connection closed then isConnected is false', function () {
            socketIO.connect = function(){
                return connectionNotConnected;
            };
            socketIOWrapper.connect();

            socketIOWrapper.isConnected().should.be.false;
        });

        it('Given connection opened then isConnected is true', function () {
            socketIO.connect = function(){
                return connectionConnected;
            };
            socketIOWrapper.connect();

            socketIOWrapper.isConnected().should.be.true;
        });

        it('Given connection opened When disconnect Then disconnect socketIO', function () {
            var called = false;
            socketIO.connect = function(){
                return {
                    socket: {
                        open: true
                    },
                    disconnect: function() {
                        called = true;
                    }
                };
            };
            socketIOWrapper.connect();

            socketIOWrapper.disconnect();

            called.should.be.true;
        });

        it('Given connection closed When disconnect Then not disconnect socketIO', function () {
            var called = false;
            socketIO.connect = function(){
                return {
                    socket: {
                        open: false
                    },
                    disconnect: function() {
                        called = true;
                    }
                };
            };
            socketIOWrapper.connect();

            socketIOWrapper.disconnect();

            called.should.be.false;
        });

        it('Given connection closed When Send Then raise exception', function () {
            socketIO.connect = function(){
                return connectionNotConnected;
            };
            socketIOWrapper.connect();

            (function() {
                socketIOWrapper.send();
            }).should.throw("Impossible to connect at server")
        });

        it('Given connection opened When Send Then call emit on socketIO', function () {
            var msgNameSended;
            var dataSended;
            socketIO.connect = function(){
                return {
                    socket: {
                        open: true
                    },
                    emit: function(msgName, data) {
                        msgNameSended = msgName;
                        dataSended = data;
                    }
                };
            };
            socketIOWrapper.connect();

            socketIOWrapper.send("essai", { data: 5 });

            msgNameSended.should.equal("essai");
            dataSended.should.eql({ data: 5 });
        });
    });
});