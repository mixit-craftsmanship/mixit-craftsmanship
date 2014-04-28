var talksRepository = require('../libs/talksRepository');
var apiServer = require('../libs/apiServer');

var list = function (req, res) {
    apiServer.disableCache(res);

    talksRepository.currentTalks().then(function (talks) {
        res.send(talks);
    }).catch(function(error){
        res.send(500, error);
    });
};

exports.register = function(app){
    app.get('/api/talks/current', list);
};