var cacheFactory = require('../../libs/cacheFactory');
var promise = require('promise');

describe('Cache module', function () {
    describe('Given empty cache', function () {
        it('When call getOrExecute then execute function and return result', function (done) {
            var executed = false;
            var cache = cacheFactory.create();

            cache.getOrExecute('essai', function(){
                executed = true;
                return 5;
            }).then(function (result) {
                executed.should.be.true;
                result.should.equal(5);
                done();
            }).catch(done);
        });

        it('When call getOrExecute with promise then execute function and return result', function (done) {
            var cache = cacheFactory.create();
            var executed = false;

            cache.getOrExecute('essai', function(){
                return new promise(function(resolve){
                    executed = true;
                    resolve(5);
                });
            }).then(function (result) {
                executed.should.be.true;
                result.should.equal(5);
                done();
            }).catch(done);
        });

        it('When call getOrExecute with promise then execute function and return result', function (done) {
            var cache = cacheFactory.create();
            var executed = false;

            cache.getOrExecute('essai', function(){
                return new promise(function(resolve){
                    executed = true;
                    resolve(5);
                });
            }).then(function (result) {
                executed.should.be.true;
                result.should.equal(5);
                done();
            }).catch(done);
        });

        it('When call getOrExecute with error function then execute function and raise exception', function (done) {
            var cache = cacheFactory.create();

            cache.getOrExecute('essai', function(){
                return new promise(function(resolve, reject){
                    reject('error');
                });
            }).then(function () {
                done('Not raise exception');
            }).catch(function(error){
                error.should.be.ok;
                done();
            });
        });

        it('When call getOrExecute with error function then result is not in cache', function (done) {
            var cache = cacheFactory.create();

            cache.getOrExecute('essai', function(){
                return new promise(function(resolve, reject){
                    reject('error');
                });
            }).then(function () {
                done('Not raise exception');
            }).catch(function(error){
                return cache.getOrExecute('essai', function(){
                    return 50;
                }).then(function(result){
                    result.should.equal(50);
                    done();
                });
            }).catch(done);
        });
    });

    describe('Given a cache with key essai', function () {
        var cacheKey = 'essai';
        var cacheValue = 5;
        var cache;
        beforeEach(function(done){
            cache = cacheFactory.create();
            cache.getOrExecute(cacheKey, function(){
                return cacheValue;
            }).then(function(){
                done();
            }).catch(done);
        });

        it('When call getOrExecute then not execute function and return cacheValue', function (done) {
            var executed = false;

            cache.getOrExecute(cacheKey, function(){
                executed = true;
                return 10;
            }).then(function (result) {
                executed.should.be.false;
                result.should.equal(cacheValue);
                done();
            }).catch(done);
        });

        it('When clean then clean cache', function (done) {
            var executed = false;

            cache.clean(cacheKey);

            cache.getOrExecute(cacheKey, function(){
                executed = true;
                return 10;
            }).then(function (result) {
                executed.should.be.true;
                result.should.equal(10);
                done();
            }).catch(done);
        });

        it('When call getOrExecute with other key then execute function and return result', function (done) {
            var executed = false;

            cache.getOrExecute("otherCache", function(){
                executed = true;
                return 10;
            }).then(function (result) {
                executed.should.be.true;
                result.should.equal(10);
                done();
            }).catch(done);
        });

        it('When clean with other key then not clean cache of key', function (done) {
            var executed = false;

            cache.clean("otherCache");

            cache.getOrExecute(cacheKey, function(){
                executed = true;
                return 10;
            }).then(function (result) {
                executed.should.be.false;
                result.should.equal(5);
                done();
            }).catch(done);
        });
    });

});
