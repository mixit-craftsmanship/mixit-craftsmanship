var mongoWrapper = require('./mongoWrapper');
var mongoConfiguration = require('./globalConfiguration').mongo;
var _ = require('underscore');
var promise = require('promise');
var talksRepository = require('./talksRepository');

var dateStepInMinute = 20;

exports.getVoteStatistiques = function(start, end){
    return promise.resolve().then(function(){
        if(start > end) throw "La date de début doit être inferieur à la date de fin";

        return mongoWrapper.getVoteStatistiques(mongoConfiguration.getTalkVotesCollectionName());
    }).then(function(mongoResults){
        return talksRepository.getTalkIds().then(function(talkIds){
            var results = [];
            var currentDate = new Date(start.getTime());

            mongoResults = _.map(mongoResults, function(item){
                return {
                    key: item._id.day + '-' + item._id.hour + '-' + item._id.minutes,
                    talks: item.talks
                };
            });

            do{
                var result = {
                    date: new Date(currentDate.getTime())
                };

                var keySearched = currentDate.getDate() + '-' + currentDate.getHours() + '-' + currentDate.getMinutes();
                var mongoVotes = _.findWhere(mongoResults, { key: keySearched }) || {};

                for(var key in talkIds){
                    var talkId = talkIds[key];
                    var mongoTalkVote = _.findWhere(mongoVotes.talks, {"talkId":talkId});
                    if(mongoTalkVote){
                        result[talkId] = mongoTalkVote.total;
                    } else {
                        result[talkId] = 0;
                    }
                }

                results.push(result);

                currentDate.setMinutes(currentDate.getMinutes() + dateStepInMinute);
            } while(currentDate <= end);

            return results;
        });
    });
};
