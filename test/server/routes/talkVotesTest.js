var talkVotes = require('../../../routes/talkVotes');
var votesRepository = require('../../../libs/votesRepository');

describe('TalkVotes route', function () {
    var oldVotesRepositoryPushVotes = votesRepository.pushVotes;
    after(function(){
        votesRepository.pushVotes = oldVotesRepositoryPushVotes;
    });

    var voteCallback;
    var socket;
    var sendMessage;
    before(function () {
        votesRepository.pushVotes = function(){};

        socket = {
            on: function(_, connection){
                connection({
                    on: function(msg, vote){
                        voteCallback = vote;
                    },
                    emit: function(msg){
                        sendMessage(msg);
                    }
                });
            }
        };
    });

    it('When register Then register connection msg', function () {
        var msgUsed;
        talkVotes.register({
            on: function(msg){
                msgUsed = msg;
            }
        });

        msgUsed.should.equal('connection');
    });

    it('When connection msg Then register vote msg', function () {
        var msgUsed;
        talkVotes.register({
            on: function(_, callback){
                callback({
                    on: function(msg){
                        msgUsed = msg;
                    }
                });
            }
        });

        msgUsed.should.equal('vote');
    });

    it('When vote msg Then save vote', function () {
        var talkIdSaved;
        var votesNbSaved;
        votesRepository.pushVotes = function(talkId, votesNb){
            talkIdSaved = talkId;
            votesNbSaved = votesNb;
            return {
                catch: function() {}
            };
        };
        talkVotes.register(socket);

        voteCallback({ talkId: 5, votesNb: 1 });

        talkIdSaved.should.equal(5);
        votesNbSaved.should.equal(1);
    });

    it('When vote msg Then cast paramters to int', function () {
        var talkIdSaved;
        var votesNbSaved;
        votesRepository.pushVotes = function(talkId, votesNb){
            talkIdSaved = talkId;
            votesNbSaved = votesNb;
            return {
                catch: function() {}
            };
        };
        talkVotes.register(socket);

        voteCallback({ talkId: '5', votesNb: '1' });

        talkIdSaved.should.equal(5);
        votesNbSaved.should.equal(1);
    });

    it('When vote msg with bad date Then send InvalidTalk msg and not save', function () {
        var msgSended;
        sendMessage = function(msg) {
            msgSended = msg;
        };
        var pushVotesCalled = false;
        votesRepository.pushVotes = function(){
            pushVotesCalled = true;
        };
        talkVotes.register(socket);

        voteCallback({ });

        msgSended.should.equal('InvalidTalk');
        pushVotesCalled.should.be.false;
    });

    it('When vote msg and error on pushVotes Then send InvalidTalk msg', function () {
        var msgSended;
        sendMessage = function(msg) {
            msgSended = msg;
        };
        votesRepository.pushVotes = function(){
            return {
                catch: function(callback) {
                    callback('error');
                }
            }
        };
        talkVotes.register(socket);

        voteCallback({ talkId: '5', votesNb: '1' });

        msgSended.should.equal('InvalidTalk');
    });
});