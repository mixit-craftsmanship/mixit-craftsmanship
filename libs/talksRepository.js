var mixitApi = require('./mixitApi');
var _ = require('underscore');

exports.getTalk = function (talkId) {
    return mixitApi.talks().then(function (talks) {
        var talk = _.findWhere(talks, { id: talkId });
        if(talk === undefined){
            throw 'Talk id ' + talkId + ' is invalid';
        }

        var start = talk.start && new Date(talk.start);
        var end = talk.end && new Date(talk.end);
        return {
            id: talk.id,
            title: talk.title,
            description: talk.description,
            room: talk.room,
            start: start,
            end: end
        };
    });
};

exports.currentTalks = function () {
    return mixitApi.talks().then(function (talks) {
        var now = new Date();
        return _.filter(talks, function (item) {
            if (item.end !== undefined && new Date(item.end) < now) {
                return false;
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
