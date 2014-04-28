var votesRepository = require('../../../libs/votesRepository');
var talksRepository = require('../../../libs/talksRepository');
var votesStore = require('../../../libs/votesStore');
var promise = require('promise');
var timekeeper = require('timekeeper');

describe('Talks repository', function() {
    var oldTalksRepositoryGetTalk = talksRepository.getTalk;
    var oldVotesStoreSave = votesStore.save;
    after(function () {
        talksRepository.getTalk = oldTalksRepositoryGetTalk;
        votesStore.save = oldVotesStoreSave;
    });

    var now = new Date("2014-04-29T09:00:00.000+02:00");

    before(function(){
        votesStore.save = function() {};
    });

    var result;
    beforeEach(function () {
        result = {
            "id": 540,
            "title": "Biotech breaks free!",
            "start": new Date("2014-04-29T08:00:00.000+02:00"),
            "end": new Date("2014-04-29T09:40:00.000+02:00"),
            "room": "Grand Amphi"
        };

        talksRepository.getTalk = function(talkId){
            return promise.resolve(result);
        };

        timekeeper.freeze(new Date(now.valueOf()));
    });

    it('Given 0 vote When pushVotes Then not call getTalk', function (done) {
        var called = false;
        votesStore.save = function(){
            called = true;
        };

        votesRepository.pushVotes(1, 0).then(function () {
            called.should.be.false;
            done();
        }).catch(done);
    });

    it('When pushVotes Then use talksRepository', function (done) {
        var talkIdUsed;
        talksRepository.getTalk = function(talkId){
            talkIdUsed = talkId;
            return promise.resolve(result);
        };

        votesRepository.pushVotes(1, 5).then(function () {
            talkIdUsed.should.equal(1);
            done();
        }).catch(done);
    });

    it('Given bad talkId When pushVotes Then raise error', function (done) {
        talksRepository.getTalk = function(){
            return promise.reject("Bad talkId");
        };

        votesRepository.pushVotes(1, 5).then(function () {
            done('Should return error');
        }).catch(function(){
            done();
        });
    });

    it('Given talk without dates When pushVotes Then save already', function (done) {
        delete result.start;
        delete result.end;
        var called = false;
        votesStore.save = function(){
            called = true;
        };

        votesRepository.pushVotes(540, 5).then(function () {
            called.should.be.true;
            done();
        }).catch(done);
    });

    it('Given talk with start after now When pushVotes Then raise error', function (done) {
        result.start = new Date("2014-04-29T10:00:00.000+02:00");
        var called = false;
        votesStore.save = function(){
            called = true;
        };

        votesRepository.pushVotes(540, 5).then(function () {
            done('should raise error');
        }).catch(function () {
            called.should.be.false;
            done();
        }).catch(done);
    });

    it('Given talk with start before now but end before now - 30M When pushVotes Then raise error', function (done) {
        result.end = new Date("2014-04-29T08:29:00.000+02:00");
        var called = false;
        votesStore.save = function(){
            called = true;
        };

        votesRepository.pushVotes(540, 5).then(function () {
            done('should raise error');
        }).catch(function () {
            called.should.be.false;
            done();
        }).catch(done);
    });

    it('Given talk with start before now but end before now - 29M When pushVotes Then save', function (done) {
        result.end = new Date("2014-04-29T08:31:00.000+02:00");
        var called = false;
        votesStore.save = function(){
            called = true;
        };

        votesRepository.pushVotes(540, 5).then(function () {
            called.should.be.true;
            done();
        }).catch(done);
    });

    it('When pushVotes Then save with good date', function (done) {
        var talkIdUsed;
        var votesNbUsed;
        votesStore.save = function(talkId, votesNb){
            talkIdUsed = talkId;
            votesNbUsed = votesNb;
        };

        votesRepository.pushVotes(540, 5).then(function () {
            talkIdUsed.should.equal(540);
            votesNbUsed.should.equal(5);
            done();
        }).catch(done);
    });

    it('Given 11 votes When pushVotes Then save 10 votes', function (done) {
        var talkIdUsed;
        var votesNbUsed;
        votesStore.save = function(talkId, votesNb){
            talkIdUsed = talkId;
            votesNbUsed = votesNb;
        };

        votesRepository.pushVotes(540, 11).then(function () {
            talkIdUsed.should.equal(540);
            votesNbUsed.should.equal(10);
            done();
        }).catch(done);
    });
});