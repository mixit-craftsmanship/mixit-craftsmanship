var talksRepository = require('../libs/talksRepository');

exports.list = function (req, res) {
    talksRepository.currentTalks().then(function (talks) {
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);

        res.send(talks);
    }).catch(function(error){
        res.send(500, error);
    });
};