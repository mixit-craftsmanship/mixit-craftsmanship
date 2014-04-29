var votesStore = require('../../../libs/votesStore');
var mongoWrapper = require('../../../libs/mongoWrapper');
var timer = require('../../../libs/timer');
var mongoConfiguration = require('../../../libs/globalConfiguration').mongo;
var timekeeper = require('timekeeper');

describe('Votes store module', function() {
    var oldMongoWrapperInsertItems = mongoWrapper.insertItems;
    var oldTimerCreate = timer.create;
    var oldConfigurationGetCollectioName = mongoConfiguration.getTalkVotesCollectionName;
    after(function () {
        timer.create = oldTimerCreate;
        mongoWrapper.insertItems = oldMongoWrapperInsertItems;
        mongoConfiguration.getTalkVotesCollectionName = oldConfigurationGetCollectioName;
    });

    var now = new Date("2014-04-29T09:25:00.000+02:00");

    var stored = false;
    var endTimer;
    beforeEach(function () {
        stored = false;
        mongoWrapper.insertItems = function () {
            stored = true;
        };
        timer.create = function(delay, callback){
            endTimer = callback;
            return {
                start: function(){},
                stop: function() {}
            }
        };

        timekeeper.freeze(now);
    });

    it('When save Then not store result before timer', function () {
        votesStore.save(5, 1);

        stored.should.be.false;
    });

    it('When configure Then create a timer and start', function () {
        var delayUsed;
        var started = false;
        timer.create = function(delay){
            delayUsed = delay;
            return {
                start: function(){
                    started = true;
                },
                stop: function(){}
            }
        };

        votesStore.configuration(1000);

        delayUsed.should.equal(1000);
        started.should.be.true;
    });

    it('Given already configured When configure Then stop previous timer', function () {
        var stopped = false;
        var oldTimer = timer.create;
        timer.create = function(){
            return {
                start: function(){},
                stop: function() { stopped = true; }
            }
        };
        votesStore.configuration(1000);

        timer.create = oldTimer;
        votesStore.configuration(1000);

        stopped.should.be.true;
    });

    it('When timer ended Then store in mongodb', function () {
        votesStore.configuration(1000);

        endTimer();
        stored.should.be.true;
        stored = false;

        endTimer();
        stored.should.be.true;
    });

    it('When store Then store with date, talkId and votesNb', function () {
        votesStore.configuration(1000);
        var savedItems;
        mongoWrapper.insertItems = function (collectionName, items) {
            savedItems = items;
        };
        timekeeper.freeze(new Date("2014-04-29T09:25:00.000+02:00"));

        votesStore.save(5, 2);
        endTimer();

        savedItems.should.eql({
            '5-25-9-0-2': {
                talkId: 5,
                minute: 25,
                hour: 9,
                second: 0,
                day: 2,
                key: '5-25-9-0-2',
                nb: 2
            }
        });
    });

    it('When store Then store in talkVole collection', function () {
        mongoConfiguration.getTalkVotesCollectionName = function(){
            return 'talkVote';
        };
        votesStore.configuration(1000);
        var collectionNameUsed;
        mongoWrapper.insertItems = function (collectionName, items) {
            collectionNameUsed = collectionName;
        };

        votesStore.save(5, 2);
        endTimer();

        collectionNameUsed.should.equal('talkVote');
    });

    it('When store Then store by interval of 5s', function () {
        votesStore.configuration(1000);
        var savedItems;
        mongoWrapper.insertItems = function (collectionName, items) {
            savedItems = items;
        };
        timekeeper.freeze(new Date("2014-04-29T09:25:13.000+02:00"));

        votesStore.save(5, 2);
        endTimer();

        savedItems.should.eql({
            '5-25-9-10-2': {
                talkId: 5,
                minute: 25,
                hour: 9,
                second: 10,
                day: 2,
                key: '5-25-9-10-2',
                nb: 2
            }
        });
    });

    it('Given several votes When store Then store all times and clean', function () {
        votesStore.configuration(1000);
        var savedItems;
        mongoWrapper.insertItems = function (collectionName, items) {
            savedItems = items;
        };

        votesStore.save(5, 2);
        votesStore.save(6, 2);
        endTimer();

        savedItems['5-25-9-0-2'].should.be.ok;
        savedItems['6-25-9-0-2'].should.be.ok;

        endTimer();
        savedItems.should.eql({});
    });

    it('Given several votes same talk When store Then sum votes', function () {
        votesStore.configuration(1000);
        var savedItems;
        mongoWrapper.insertItems = function (collectionName, items) {
            savedItems = items;
        };

        votesStore.save(5, 2);
        votesStore.save(5, 3);
        endTimer();

        savedItems['5-25-9-0-2'].nb.should.equal(5);
    });
});