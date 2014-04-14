var talksRepository = require('../libs/talksRepository');

exports.list = function (req, res) {
    talksRepository.currentTalks().then(function (talks) {
        res.send(talks);
    }).catch(function(error){
        res.send(500, error);
    });
};