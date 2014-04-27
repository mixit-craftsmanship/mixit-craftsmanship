var mixitApi = require('./mixitApi');
var _ = require('underscore');

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
                room: item.room
            };
        });
    });
};