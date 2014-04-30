var statistiqueRepository = require('../libs/statistiqueRepository');
var talksRepository = require('../libs/talksRepository');

var stats = function(req, res){
    statistiqueRepository.getVoteStatistiques(new Date(2014, 3, 29, 8), new Date()).then(function(result){
        return talksRepository.getTalksWithIdAndName().then(function(talks) {
            res.send({ dataSource: result, series: talks});
        });
    }).catch(function(error){
        res.send(500, error);
    });
};

exports.register = function(app){
    app.get('/api/stats', stats);
};