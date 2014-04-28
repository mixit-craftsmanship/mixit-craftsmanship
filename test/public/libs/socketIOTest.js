define(['libs/socketIO', 'socketIO', 'libs/timer'], function(socketIOWrapper, socketIO, timer) {
    describe('SocketIO module', function () {
        var oldConnect = socketIO.connect;
        var oldTimerCreate = timer.create;
        after(function(){
            socketIO.connect = oldConnect;
            timer.create = oldTimerCreate;
        });

        before(function(){
            socketIO.connect = function(){};
            timer.create = function(){};
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

        var timerStart = function() { };
        var timerStop = function() { };
        var timerCallback;
        var timerDelay;
        beforeEach(function(){
            timer.create = function(delay, callback){
                timerCallback = callback;
                timerDelay = delay;
                return {
                    start: function(){ timerStart(); },
                    stop: function(){ timerStop(); }
                };
            };
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

        it('When connect Then return promise', function () {
            var result = socketIOWrapper.connect();

            result.done.should.be.ok;
            result.fail.should.be.ok;
        });

        it('When connect Then start timer to check connection', function () {
            var called = false;
            timerStart = function(){
                called = true;
            };

            socketIOWrapper.connect();

            timerDelay.should.equal(100);
            timerCallback.should.be.ok;
            called.should.be.true;
        });

        it('When connect Then not raise resolve if socket is not connected', function () {
            socketIO.connect = function(){
                return connectionNotConnected;
            };

            var called = false;
            socketIOWrapper.connect().done(function(){
                called = true;
            });

            called.should.be.false;
            timerCallback();
            called.should.be.false;
            timerCallback();
            called.should.be.false;
        });

        it('When connect Then raise resolve if socket is connected', function () {
            var socket = {
                socket: {
                    open: false
                }
            };
            socketIO.connect = function(){
                return socket;
            };

            var called = false;
            socketIOWrapper.connect().done(function(){
                called = true;
            });

            called.should.be.false;
            timerCallback();
            called.should.be.false;

            socket.socket.open = true;
            timerCallback();
            called.should.be.true;
        });

        it('When connect Then raise reject if socket is not connected after try 50 times', function () {
            socketIO.connect = function(){
                return connectionNotConnected;
            };

            var called = false;
            socketIOWrapper.connect().fail(function(){
                called = true;
            });

            for(var i = 0; i <= 50; i++){
                timerCallback();
                called.should.be.false;
            }

            timerCallback();
            called.should.be.true;
        });

        it('When reject connection Then stop timer', function () {
            var called = false;
            timerStop = function() {
                called = true;
            };
            socketIO.connect = function(){
                return connectionNotConnected;
            };

            socketIOWrapper.connect();

            for(var i = 0; i <= 51; i++){
                timerCallback();
            }

            called.should.be.true;
        });

        it('When call on with msg Then call on on socket', function () {
            var called = false;
            var msgNameUsed;
            var socket = {
                on: function(msgName, callBack){
                    msgNameUsed = msgName;
                    callBack();
                }
            };
            socketIO.connect = function(){
                return socket;
            };
            socketIOWrapper.connect();

            socketIOWrapper.on("essai", function(){
                called = true;
            });

            called.should.be.true;
            msgNameUsed.should.equal("essai");
        });
    });
});