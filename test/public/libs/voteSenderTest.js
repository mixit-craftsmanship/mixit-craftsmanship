define(['libs/voteSender', 'libs/socketIO', 'libs/timer'], function(voteSender, socketIO, timerFactory) {
    describe('voteSender module', function () {
        var oldTimerCreate = timerFactory.create;
        var oldConnect = socketIO.connect;
        var oldDisconnect = socketIO.disconnect;
        var oldSend = socketIO.send;
        var oldIsConnected = socketIO.isConnected;
        after(function(){
            timerFactory.create = oldTimerCreate;
            socketIO.connect = oldConnect;
            socketIO.disconnect = oldDisconnect;
            socketIO.send = oldSend;
            socketIO.isConnected = oldIsConnected;
        });

        var timerStopped = false;
        var timerStart = function(){};
        var timerStop = function(){ timerStopped = true; };
        var timerDelay;
        var timerCallback;
        before(function(){
            timerFactory.create = function(delay, callback){
                timerDelay = delay;
                timerCallback = callback;
                return {
                    start: timerStart,
                    stop: timerStop
                }
            };
        });

        beforeEach(function(){
            socketIO.connect = function(){};
            socketIO.disconnect = function(){};
            socketIO.send = function(){};
            socketIO.isConnected = function(){ return true; };
            timerStopped = false;
        });

        it('when send Then create timer with delay 1s', function () {
            voteSender.send(1);

            timerDelay.should.equal(1000);
        });

        it('when send several times Then create timer once time', function () {
            var calledNb = 0;
            timerFactory.create = function(){
                calledNb++;
            };
            voteSender.send(1);

            calledNb.should.equal(0);
        });

        it('when call isEnabled Then return if socketIO is connected', function () {
            var called = false;
            socketIO.isConnected = function(){
                called = true;
                return true;
            };

            var result = voteSender.isEnabled();

            called.should.be.true;
            result.should.be.true;
        });

        it('when enable Then connect socketIO', function () {
            var called = false;
            socketIO.connect = function(){
                called = true;
            };

            voteSender.enable();

            called.should.be.true;
        });

        it('when disable Then disconnect socketIO', function () {
            var called = false;
            socketIO.disconnect = function(){
                called = true;
            };

            voteSender.disable();

            called.should.be.true;
        });

        it('when disable Then stop timer', function () {
            voteSender.disable();

            timerStopped.should.be.true;
        });

        it('when timer ended and no vote Then no message sended', function () {
            var called = false;
            socketIO.send = function(){
                called = true;
            };

            timerCallback();

            called.should.be.false;
        });

        it('when timer ended and a vote Then send message with talkId and votesNb', function () {
            var dataSended;
            var msgNameSended;
            socketIO.send = function(msgName, data){
                dataSended = data;
                msgNameSended = msgName;
            };

            voteSender.send(5);
            timerCallback();

            dataSended.should.be.ok;
            dataSended.should.eql({ talkId: '5', votesNb: 1 });
            msgNameSended.should.equal('vote');
        });

        it('when timer ended and several votes for same talk Then send message with talkId and votesNb', function () {
            var dataSended;
            var msgNameSended;
            socketIO.send = function(msgName, data){
                dataSended = data;
                msgNameSended = msgName;
            };

            voteSender.send(5);
            voteSender.send(5);
            voteSender.send(5);
            timerCallback();

            dataSended.should.be.ok;
            dataSended.should.eql({ talkId: '5', votesNb: 3 });
            msgNameSended.should.equal('vote');
        });

        it('when timer ended and several votes for several talks Then send message by talk', function () {
            var sended = [];
            socketIO.send = function(msgName, data){
                sended.push(data);
            };

            voteSender.send(5);
            voteSender.send(5);
            voteSender.send(6);
            timerCallback();

            sended.should.contain({ talkId: '5', votesNb: 2 });
            sended.should.contain({ talkId: '6', votesNb: 1 });
        });

        it('when timer ended Then clear votes', function () {
            voteSender.send(5);
            timerCallback();

            var called = false;
            socketIO.send = function(){
                called = true;
            };

            timerCallback();

            called.should.be.false;
        });

        it('when enable Then return socketIO connection promise', function () {
            socketIO.connect = function(){
                return { name: 'A' };
            };

            var result = voteSender.enable();

            result.should.eql({ name: 'A' });
        });
    });
});