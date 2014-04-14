var talksRepository = require('../../libs/talksRepository');
var mixitApi = require('../../libs/mixitApi');
var Promise = require('Promise');
var timekeeper = require('timekeeper');

describe('Sessions controller', function() {
    var now = new Date(2014, 3, 29, 9, 25);

    var result;
    beforeEach(function(){
        result = [{"id":540,"title":"Biotech breaks free!","summary":"[...]","description":"[...]","language":"en","interests":[831,828,826,829,830,808,827],"speakers":[1066],"format":"Keynote","level":"Beginner",
            "start":"2014-04-29T09:15:00.000+02:00","end":"2014-04-29T09:40:00.000+02:00","room":"Grand Amphi"}];
        mixitApi.talks = function() {
            return Promise.resolve(result);
        };

        timekeeper.freeze(now);
    });


    it('When get current talks should return current talks list', function (done) {
        talksRepository.currentTalks().then(function(talks){
            talks.should.have.length(1);
            done();
        }).catch(done);
    });


    it('Given talks without start and talk is not ended When get current talks Then return this talk', function (done) {
        delete result[0].start;

        talksRepository.currentTalks().then(function(talks){
            talks.should.have.length(1);
            done();
        }).catch(done);
    });

    it('Given talks without start and talk is ended When get current talks Then do not return this talk', function (done) {
        delete result[0].start;
        result[0].end = "2014-04-29T08:40:00.000+02:00";

        talksRepository.currentTalks().then(function(talks){
            talks.should.have.length(0);
            done();
        }).catch(done);
    });

    it('Given talks without end and talk is not started When get current talks Then do not return this talk', function (done) {
        delete result[0].end;
        result[0].start = "2014-04-29T10:40:00.000+02:00";

        talksRepository.currentTalks().then(function(talks){
            talks.should.have.length(0);
            done();
        }).catch(done);
    });

    it('Given talks without end and talk is started When get current talks Then return this talk', function (done) {
        delete result[0].end;

        talksRepository.currentTalks().then(function(talks){
            talks.should.have.length(1);
            done();
        }).catch(done);
    });

    it('Given talks without end and start When get current talks Then return this talk', function (done) {
        delete result[0].end;
        delete result[0].start;

        talksRepository.currentTalks().then(function(talks){
            talks.should.have.length(1);
            done();
        }).catch(done);
    });

});