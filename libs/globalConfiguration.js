var _ = require('underscore');

var configuration = require('../configuration').configuration;

exports.initialize = function(config) {
    configuration = config;
};

var getExternalJavascriptNames = function(){
    var result = [];
    for(var name in configuration) {
        var libs = configuration[name];
        if(libs.javascript !== undefined) {
            result.push(name);
        }
    }

    return result;
};

exports.client = {
    getExternalJavascriptNames: function(){
        return getExternalJavascriptNames();
    },
    getExternalJavascriptsWithLocalPath: function(){
        var names = getExternalJavascriptNames();
        return _.map(names, function(name){
            var path = configuration[name].javascript.local;
            return { name: name, path: path };
        });
    },
    getProxyUrlsInDevelopment: function(){
        var result = [];
        for(var name in configuration) {
            var libs = configuration[name];
            if(libs.javascript !== undefined) {
                result.push({ url: '/javascripts/' + name + '.js', file: libs.javascript.local });
            }

            if(libs.stylesheet !== undefined) {
                result.push({ url: '/stylesheet/' + name + '.css', file: libs.stylesheet.local });
            }

            if(libs.resources !== undefined) {
                result.push({ url: libs.resources.url, directory: libs.resources.path });
            }
        }

        return result;
    },
    getCdnStylesheets: function(){
        var result = [];
        for(var name in configuration) {
            var libs = configuration[name];
            if(libs.stylesheet !== undefined) {
                result.push(libs.stylesheet.dist);
            }
        }

        return result;
    },
    getCdnJavascripts: function(){
        var names = getExternalJavascriptNames();
        return _.map(names, function(name){
            return configuration[name].javascript.dist;
        });
    }
};
