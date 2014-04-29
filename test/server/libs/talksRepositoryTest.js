var talksRepository = require('../../../libs/talksRepository');
var mixitApi = require('../../../libs/mixitApi');
var promise = require('promise');
var timekeeper = require('timekeeper');
var _ = require('underscore');

describe('Talks repository', function() {
    var oldMixitApiTalks = mixitApi.talks;
    after(function(){
        mixitApi.talks = oldMixitApiTalks;
    });

    var now = new Date("2014-04-29T09:25:00.000+02:00");

    var talksContainsTalkWithId = function(talks, id) {
        _.filter(talks, function(talk) {
            return talk.id == id;
        }).should.have.length(1);
    };

    var result;
    beforeEach(function(){
        result = [{"id":540,"title":"Biotech breaks free!","summary":"[...]","description":"[...]","language":"en","interests":[831,828,826,829,830,808,827],"speakers":[1066],"format":"Keynote","level":"Beginner",
            "start":"2014-04-29T09:15:00.000+02:00","end":"2014-04-29T09:40:00.000+02:00","room":"Grand Amphi"},
                {"id":440,"title":"Back to the future!","summary":"[...]","description":"[...]","language":"en","interests":[831,828,826,829],"speakers":[1066],"format":"Keynote","level":"Beginner",
            "start":"2014-04-29T16:30:00.000+02:00","end":"2014-04-29T16:40:00.000+02:00","room":"Grand Amphi"},
                 {"id":440,"title":"Back to the future!","summary":"[...]","description":"[...]","language":"en","interests":[831,828,826,829],"speakers":[1066],"format":"Keynote","level":"Beginner",
            "start":"2014-04-29T10:00:00.000+02:00","end":"2014-04-29T10:10:00.000+02:00","room":"Grand Amphi"},
                 {"id":441,"title":"I've seen the future, it's in my browser!","summary":"[...]","description":"[...]","language":"en","interests":[831,828,826,829],"speakers":[1066],"format":"Keynote","level":"Beginner",
            "start":"2014-04-29T09:30:00.000+02:00","end":"2014-04-29T09:40:00.000+02:00","room":"Petit Amphi"},
                {"id":442,"title":"9 min past session !","summary":"[...]","description":"[...]","language":"en","interests":[831,828,826,829],"speakers":[1066],"format":"Keynote","level":"Beginner",
            "start":"2014-04-29T09:10:00.000+02:00","end":"2014-04-29T09:16:00.000+02:00","room":"Petit Amphi"}];
        mixitApi.talks = function() {
            return promise.resolve(result);
        };

        timekeeper.freeze(now);
    });

    describe('When get current talks', function() {
        it('Then return current talks list and talk 10 min before', function (done) {
            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(2);
                done();
            }).catch(done);
        });

        it('Given talks without start and talk is not ended pass 10 minutes Then return this talk', function (done) {
            delete result[0].start;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(2);
                done();
            }).catch(done);
        });

        it('Given talks without end and talk is started Then return this talk', function (done) {
            delete result[0].end;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(2);
                done();
            }).catch(done);
        });


        it('Given talks without start and talk is ended Then do not return this talk', function (done) {
            delete result[0].start;
            result[0].end = "2014-04-29T08:40:00.000+02:00";

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(1);
                done();
            }).catch(done);
        });

        it('Given talks without end and talk is not started Then do not return this talk', function (done) {
            delete result[0].end;
            result[0].start = "2014-04-29T10:40:00.000+02:00";

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(1);
                done();
            }).catch(done);
        });

        it('Given talks without end and talk is started Then return this talk', function (done) {
            delete result[0].end;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(2);
                done();
            }).catch(done);
        });

        it('Given talks without end and start Then return this talk', function (done) {
            delete result[0].end;
            delete result[0].start;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(2);
                done();
            }).catch(done);
        });

        it('Given good talks Then return talks with id, title, description and room', function (done) {
            delete result[0].end;
            delete result[0].start;

            talksRepository.currentTalks().then(function (talks) {
                talks.should.have.length(2);
                var talk = talks[0];

                talk.id.should.equal(540);
                talk.title.should.equal("Biotech breaks free!");
                talk.description.should.equal("[...]");
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

    describe('When get next talks', function() {
        it('returns coming talks within 1 hour', function (done) {
            talksRepository.nextTalks().then(function (talks) {
                talks.should.have.length(2);
                talksContainsTalkWithId(talks, 440);
                talksContainsTalkWithId(talks, 441);
                done();
            }).catch(done);
        });

        it('order coming talks properly', function (done) {
            talksRepository.nextTalks().then(function (talks) {
                talks[0].id.should.be.exactly(441);
                talks[1].id.should.be.exactly(440);
                done();
            }).catch(done);
        });
    });
});
