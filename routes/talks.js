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

var listNext = function (req, res) {
    apiServer.disableCache(res);

    talksRepository.nextTalks().then(function (talks) {
        res.send(talks);
    }).catch(function(error){
        res.send(500, error);
    });
};

var get = function (req, res) {
    talksRepository.getTalk(req.params.id).then(function (talk) {
        res.send(talk);
    }).catch(function(error){
        res.send(500, error);
    });
};


exports.register = function(app){
    app.get('/api/talks/current', list);
    app.get('/api/talks/next', listNext);
    app.get('/api/talks/:id', get);
};
