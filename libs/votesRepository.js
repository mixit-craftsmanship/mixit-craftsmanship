var talksRepository = require('./talksRepository');
var votesStore = require('./votesStore');
var _ = require('underscore');
var promise = require('promise');
var configuration = require('../configuration');

var votesNbMax = 10;
var talkEndToleranceInMinutes = 30;

var checkTalkDates = function(talk) {
    if(configuration.debugVote) {
        return;
    }

    var now = new Date();
    if (talk.start && talk.start > now) {
        throw "This talk is not started : " + talk.start;
    }

    var endLimite = new Date(now.valueOf());
    endLimite.setMinutes(endLimite.getMinutes() - talkEndToleranceInMinutes);
    if (talk.end && talk.end < endLimite) {
        throw "This talk is already finished : " + talk.end;
    }
};

exports.pushVotes = function(talkId, votesNb){
    if(votesNb <= 0){
        return promise.resolve();
    }

    if(votesNb > votesNbMax){
        votesNb = votesNbMax;
    }

    return talksRepository.getTalk(talkId).then(function(talk){
        checkTalkDates(talk);

        votesStore.save(talkId, votesNb);

        return true;
    });
};
