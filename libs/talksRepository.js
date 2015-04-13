var mixitApi = require('./mixitApi');
var _ = require('underscore');
var configuration = require('../configuration');

exports.getTalk = function (talkId) {
    return mixitApi.talk(talkId).then(function (talk) {
        if(talk === undefined){
            throw 'Talk id ' + talkId + ' not found';
        }

        var start = talk.start && new Date(talk.start);
        var end = talk.end && new Date(talk.end);
        return {
            id: talk.id,
            title: talk.title,
            summary: talk.summary,
            room: talk.room,
            start: start,
            end: end,
            speakers: _.map(talk.speakers, function(item) {
                return {
                    firstname: item.firstname,
                    lastname: item.lastname,
                    image: item.urlimage
                };
            })
        };
    });
};

exports.currentTalks = function () {
    return mixitApi.talks().then(function (talks) {
        var now = new Date();
        return _.filter(talks, function (item) {
            if(configuration.debugVote){
                return true;
            }

            if (item.id == 442) {
                return false;
            }
            if (item.end !== undefined) {
                var itemEndPlusTenMin = new Date(item.end);
                itemEndPlusTenMin.setMinutes(itemEndPlusTenMin.getMinutes() + 10);
                if(itemEndPlusTenMin < now)
                {
                    return false;
                }
            }

            return !(item.start !== undefined && new Date(item.start) > now);
        }).map(function (item) {
            return {
                id: item.id,
                title: item.title,
                description: item.description,
                room: item.room
            };
        });
    });
};

exports.nextTalks = function () {
    return mixitApi.talks().then(function (talks) {
        var now = new Date();
        return _.chain(talks).filter(function (item) {
            var itemStart = new Date(item.start);
            var nowPlusOneHour = new Date(now).setMinutes(now.getMinutes() + 60);
            return item.start !== undefined && itemStart > now && itemStart < nowPlusOneHour;
        }).sortBy(function (item) {
            return new Date(item.start).getTime();
        }).map(function (item) {
            return {
                id: item.id,
                title: item.title,
                room: item.room
            };
        }).value();
    });
};

exports.getTalkIds = function () {
    return mixitApi.talks().then(function (talks) {
        return _.map(talks, function(item){
            return item.id;
        });
    });
};

exports.getTalksWithIdAndName = function () {
    return mixitApi.talks().then(function (talks) {
        return _.map(talks, function(item){
            return { id: item.id, name: item.title };
        });
    });
};
