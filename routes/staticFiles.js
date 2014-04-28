var globalConfiguration = require('./../libs/globalConfiguration');
var errorHandler = require('errorhandler');
var express = require('express');

var staticFile = function(path){
    return function(req, res, next) {
        if ('GET' != req.method && 'HEAD' != req.method) {
            return next();
        }

        res.sendfile(path);
    };
};

var configDev = function(app){
    app.use(errorHandler());

    app.use(express.static(globalConfiguration.client.getPublicDirectoryInDevelopment()));

    var staticItems = globalConfiguration.client.getProxyUrlsInDevelopment();
    for(var key in staticItems){
        var item = staticItems[key];
        if(item.file !== undefined){
            app.use(item.url, staticFile(item.file));
        } else {
            app.use(item.url, express.static(item.directory));
        }
    }
};

var configProd = function(app){
    app.use(express.static(globalConfiguration.client.getPublicDirectoryInProduction()));
};

exports.register = function(app, isDevelopment){
    if(isDevelopment) configDev(app);
    else configProd(app);
};
