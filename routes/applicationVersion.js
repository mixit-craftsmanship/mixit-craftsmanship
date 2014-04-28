var globalConfiguration = require('../libs/globalConfiguration');
var apiServer = require('../libs/apiServer');

var displayVersion = function(req, res){
    apiServer.disableCache(res);

    res.send({ applicationVersion: globalConfiguration.client.getApplicationVersion() });
};

exports.register = function(app){
    app.get('/api/applicationVersion', displayVersion);
};
