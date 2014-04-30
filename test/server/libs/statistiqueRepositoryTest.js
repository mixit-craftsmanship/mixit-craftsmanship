var statistiqueRepository = require('../../../libs/statistiqueRepository');
var talksRepository = require('../../../libs/talksRepository');
var mongoWrapper = require('../../../libs/mongoWrapper');
var mongoConfiguration = require('../../../libs/globalConfiguration').mongo;
var promise = require('promise');

describe('Statistique repository', function() {
    var oldGetVoteStatistiques = mongoWrapper.getVoteStatistiques;
    var oldGetTalks = talksRepository.getTalkIds;
    var oldConfigurationGetCollectionName = mongoConfiguration.getTalkVotesCollectionName;
    after(function () {
        mongoWrapper.getVoteStatistiques = oldGetVoteStatistiques;
        mongoConfiguration.getTalkVotesCollectionName = oldConfigurationGetCollectionName;
        talksRepository.getTalkIds = oldGetTalks;
    });

    var start = new Date(2014, 3, 30, 1);
    var end = new Date(2014, 3, 30, 2);

    var mongoResults = [];
    var talkIds = [];
    beforeEach(function(){
        mongoResults = [];
        talkIds = [];
        mongoWrapper.getVoteStatistiques = function(){
            return promise.resolve(mongoResults);
        };
        talksRepository.getTalkIds = function(){
            return promise.resolve(talkIds);
        };
    });

    it('When getVoteStatistiques Then call getTalkVotesCollectionName of mongoWrapper with good collection', function (done) {
        mongoConfiguration.getTalkVotesCollectionName = function(){
            return 'talkVote';
        };
        mongoWrapper.getVoteStatistiques = function(collectionName){
            collectionName.should.equal('talkVote');
            done();
            return promise.resolve([]);
        };

        statistiqueRepository.getVoteStatistiques();
    });

    it('When getVoteStatistiques on a date range of one hour Then it returns 3 ranges', function(done){
        statistiqueRepository.getVoteStatistiques(start, end).then(function(result){
            result.should.have.length(4);

            done();
        }).catch(done);
    });

    var _ = require('underscore');

    it('Given 3 talks When getVoteStatistiques Then each ranges contains vote for each talks', function(done){
        talkIds.push(42, 44, 45);
        mongoResults.push({"_id":{"day":3,"hour":1,"minutes":0},"talks":[{"talkId":42,"total":29}, {"talkId":44,"total":31}]});

        statistiqueRepository.getVoteStatistiques(start, end).then(function(result){
            result.should.containEql({ date: new Date(2014, 3, 30, 1, 0), '42': 29, '44': 31, '45': 0 });
            result.should.containEql({ date: new Date(2014, 3, 30, 1, 20), '42': 0, '44': 0, '45': 0 });
            result.should.containEql({ date: new Date(2014, 3, 30, 1, 40), '42': 0, '44': 0, '45': 0 });
            result.should.containEql({ date: new Date(2014, 3, 30, 2, 0), '42': 0, '44': 0, '45': 0 });

            done();
        }).catch(done);
    });

    it('When end is more that start Then raise exception', function(done){
        statistiqueRepository.getVoteStatistiques(end, start).then(function(){
            done('should raise exception');
        }).catch(function(){
            done();
        });
    });
});