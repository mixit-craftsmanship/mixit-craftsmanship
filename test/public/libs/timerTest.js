define(['libs/timer'], function(timerFactory) {
    describe('Timer module', function () {
        var oldSetInterval = window.setInterval;
        var oldClearInterval = window.clearInterval;
        after(function(){
            window.setInterval = oldSetInterval;
            window.clearInterval = oldClearInterval;
        });

        var clearIntervalCalledNb = 0;
        before(function(){
            window.setInterval = function(callback, delay){
                callback(delay);
                return true;
            };
            window.clearInterval = function(){
                clearIntervalCalledNb++;
            };
        });

        beforeEach(function(){
            clearIntervalCalledNb = 0;
        });

        it('when create timer Then callback is not called before start', function () {
            var called = false;
            var timer = timerFactory.create(0, function(){
                called = true;
            });

            called.should.be.false;
        });

        it('when start timer Then callback is call each interval', function () {
            var called = false;
            var timer = timerFactory.create(0, function(){
                called = true;
            });

            timer.start();

            called.should.be.true;
            clearIntervalCalledNb.should.equal(0);
        });

        it('when stop timer Then clear interval', function () {
            var timer = timerFactory.create(0, function(){});

            timer.start();
            timer.stop();

            clearIntervalCalledNb.should.equal(1);
        });

        it('when start several times Then not restart interval', function () {
            var calledNb = 0;
            var timer = timerFactory.create(0, function(){
                calledNb++;
            });

            timer.start();
            timer.start();

            calledNb.should.equal(1);
        });

        it('when stop without start Then not clear interval', function () {
            var timer = timerFactory.create(0, function(){});

            timer.stop();

            clearIntervalCalledNb.should.equal(0);
        });

        it('when restart Then start', function () {
            var calledNb = 0;
            var timer = timerFactory.create(0, function(){
                calledNb++;
            });

            timer.restart();

            clearIntervalCalledNb.should.equal(0);
            calledNb.should.equal(1);
        });

        it('when restart several times Then stop and start', function () {
            var calledNb = 0;
            var timer = timerFactory.create(0, function(){
                calledNb++;
            });

            timer.restart();
            timer.restart();

            clearIntervalCalledNb.should.equal(1);
            calledNb.should.equal(2);
        });
    });
});