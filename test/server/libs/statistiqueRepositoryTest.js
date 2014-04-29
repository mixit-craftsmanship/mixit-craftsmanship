var statistiqueRepository = require('../../../libs/statistiqueRepository');
var mongoWrapper = require('../../../libs/mongoWrapper');
var mongoConfiguration = require('../../../libs/globalConfiguration').mongo;
var promise = require('promise');

describe('Statistique repository', function() {
    var oldGetVoteStatistiques = mongoWrapper.getVoteStatistiques;
    after(function () {
        mongoWrapper.getVoteStatistiques = oldGetVoteStatistiques;
        mongoConfiguration.getTalkVotesCollectionName = oldConfigurationGetCollectionName;
    });

    var mongoResults = [];
    beforeEach(function(){
        mongoResults = [];
        mongoWrapper.getAllItemsOfCollection = function(collectionName){
            return promise.resolve(mongoResults);
        };
    });

    it('When getStatistiqueByTalksAndMinutes Then call getAllItemsOfCollection of mongoWrapper with good collection', function () {
        mongoConfiguration.getTalkVotesCollectionName = function(){
            return 'talkVote';
        };
        var collectionNameUsed;
        mongoWrapper.getAllItemsOfCollection = function(collectionName){
            collectionNameUsed = collectionName;
            return promise.resolve([]);
        };

        statistiqueRepository.getStatistiqueByTalksAndMinutes();

        collectionNameUsed.should.equal('talkVote');
    });

    it('Sum votes by minute', function(done){
         mongoResults.push({ talkId: 428, minute: 25, hour: 12, second: 20, day: 2, nb: 1 });
         mongoResults.push({ talkId: 428, minute: 25, hour: 12, second: 25, day: 2, nb: 2 });

         statistiqueRepository.getStatistiqueByTalksAndMinutes().then(function(result){
             result.should.have.lengthOf(1);
             var firstValue = result[0];
             firstValue.should.eql({
                 talkId: 428,
                 minute: 25,
                 hour: 12,
                 day: 29,
                 nb: 3
             });

             done();
         }).catch(done);
    });

    it('Given 2 mongo items with not same talk Then return 2 items', function(done){
        mongoResults.push({ talkId: 428, minute: 25, hour: 12, second: 20, day: 2, nb: 1 });
        mongoResults.push({ talkId: 429, minute: 25, hour: 12, second: 25, day: 2, nb: 2 });

        statistiqueRepository.getStatistiqueByTalksAndMinutes().then(function(result){
            result.should.have.lengthOf(2);

            done();
        }).catch(done);
    });

    it('Given 2 mongo items with not same minute Then return 2 items', function(done){
        mongoResults.push({ talkId: 428, minute: 25, hour: 12, second: 20, day: 2, nb: 1 });
        mongoResults.push({ talkId: 428, minute: 26, hour: 12, second: 25, day: 2, nb: 2 });

        statistiqueRepository.getStatistiqueByTalksAndMinutes().then(function(result){
            result.should.have.lengthOf(2);

            done();
        }).catch(done);
    });

    it('Given item with day 2 Then return 29', function(done){
        mongoResults.push({ talkId: 428, minute: 25, hour: 12, second: 20, day: 2, nb: 1 });

        statistiqueRepository.getStatistiqueByTalksAndMinutes().then(function(result){
            result.should.have.lengthOf(1);
            result[0].day.should.equal(29);

            done();
        }).catch(done);
    });

    it('Given item with day 3 Then return 30', function(done){
        mongoResults.push({ talkId: 428, minute: 25, hour: 12, second: 20, day: 3, nb: 1 });

        statistiqueRepository.getStatistiqueByTalksAndMinutes().then(function(result){
            result.should.have.lengthOf(1);
            result[0].day.should.equal(30);

            done();
        }).catch(done);
    });
});