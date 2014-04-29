var mongoWrapper = require('./mongoWrapper');
var mongoConfiguration = require('./globalConfiguration').mongo;
var _ = require('underscore');

var cloneAndReformatPeriod = function(item){
    item = _.clone(item);
    delete item.second;

    item.day = item.day === 2 ? 29 : 30;

    return item;
};

exports.getStatistiqueByTalksAndMinutes = function(){
    return mongoWrapper.getVoteStatistiques(mongoConfiguration.getTalkVotesCollectionName()).then(function(result){
        var itemsWithoutSeconds = _.map(result, cloneAndReformatPeriod);
        var itemsGroupByTalkIdAndDate = _.groupBy(itemsWithoutSeconds, function(item){
            return item.talkId + '-' + item.day + '-' + item.hour + '-' + item.minute;
        });
        return _.map(itemsGroupByTalkIdAndDate, function(items){
            return _.reduce(items, function(acc, item){
                if(acc === undefined) {
                    return item;
                }

                acc.nb += item.nb;
                return acc;
            });
        });
    });
};
