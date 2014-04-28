var talksRepository = require('../../libs/talksRepository');
var mixitApi = require('../../libs/mixitApi');
var promise = require('promise');
var timekeeper = require('timekeeper');

describe('Talks repository', function() {
    var oldMixitApiTalks = mixitApi.talks;
    after(function(){
        mixitApi.talks = oldMixitApiTalks;
    });

    var now = new Date("2014-04-29T09:25:00.000+02:00");

    var result;
    beforeEach(function(){
        result = [{"id":540,"title":"Biotech breaks free!","summary":"[...]","description":"[...]","language":"en","interests":[831,828,826,829,830,808,827],"speakers":[1066],"format":"Keynote","level":"Beginner",
            "start":"2014-04-29T09:15:00.000+02:00","end":"2014-04-29T09:40:00.000+02:00","room":"Grand Amphi"}];
        mixitApi.talks = function() {
            return promise.resolve(result);
        };

        timekeeper.freeze(now);
    });

    describe('When get current talks', function() {
        it('Then return current talks list', function (done) {
            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(1);
                done();
            }).catch(done);
        });

        it('Given talks without start and talk is not ended Then return this talk', function (done) {
            delete result[0].start;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(1);
                done();
            }).catch(done);
        });

        it('Given talks without start and talk is ended Then do not return this talk', function (done) {
            delete result[0].start;
            result[0].end = "2014-04-29T08:40:00.000+02:00";

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(0);
                done();
            }).catch(done);
        });

        it('Given talks without end and talk is not started Then do not return this talk', function (done) {
            delete result[0].end;
            result[0].start = "2014-04-29T10:40:00.000+02:00";

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(0);
                done();
            }).catch(done);
        });

        it('Given talks without end and talk is started Then return this talk', function (done) {
            delete result[0].end;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(1);
                done();
            }).catch(done);
        });

        it('Given talks without end and start Then return this talk', function (done) {
            delete result[0].end;
            delete result[0].start;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(1);
                done();
            }).catch(done);
        });

        it('Given good talks Then return talks with id, title and room', function (done) {
            delete result[0].end;
            delete result[0].start;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(1);
                var talk = talks[0];

                talk.id.should.equal(540);
                talk.title.should.equal("Biotech breaks free!");
                talk.room.should.equal("Grand Amphi");

                done();
            }).catch(done);
        });
    });

    describe('When getTalk', function() {
        it('Given bad talkId Then throw exception', function (done) {
            talksRepository.getTalk(1).then(function (talk) {
                done('should not fund talk');
            }).catch(function(){
                done();
            });
        });

        it('Given good talkId Then throw exception', function (done) {
            talksRepository.getTalk(540).then(function (talk) {
                talk.id.should.equal(540);
                talk.title.should.be.ok;
                talk.room.should.be.ok;
                done();
            }).catch(done);
        });

        it('Given talk with start and end Then item contain date for start and end', function (done) {
            talksRepository.getTalk(540).then(function (talk) {
                talk.start.should.be.ok;
                talk.start.should.eql(new Date("2014-04-29T09:15:00.000+02:00"));
                talk.end.should.be.ok;
                talk.end.should.eql(new Date("2014-04-29T09:40:00.000+02:00"));
                done();
            }).catch(done);
        });

        it('Given talk without start but with end Then item contain date for end', function (done) {
            delete result[0].start;

            talksRepository.getTalk(540).then(function (talk) {
                (talk.start === undefined).should.be.true;
                talk.end.should.be.ok;
                done();
            }).catch(done);
        });

        it('Given talk without end but with start Then item contain date for start', function (done) {
            delete result[0].end;

            talksRepository.getTalk(540).then(function (talk) {
                talk.start.should.be.ok;
                (talk.end === undefined).should.be.true;
                done();
            }).catch(done);
        });

        it('Given talk without end and start Then item do not contain date', function (done) {
            delete result[0].start;
            delete result[0].end;

            talksRepository.getTalk(540).then(function (talk) {
                (talk.start === undefined).should.be.true;
                (talk.end === undefined).should.be.true;
                done();
            }).catch(done);
        });
    });
});