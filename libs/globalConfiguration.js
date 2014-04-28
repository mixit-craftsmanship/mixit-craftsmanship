var _ = require('underscore');

var configuration = require('../configuration');
var libsConfiguration = configuration.libsConfiguration;
var directoriesConfiguration = configuration.directoriesConfiguration;

exports.initialize = function(libs, directories) {
    libsConfiguration = libs;
    directoriesConfiguration = directories;
};

var getExternalJavascriptNames = function(){
    var result = [];
    for(var name in libsConfiguration) {
        var libs = libsConfiguration[name];
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
            var path = libsConfiguration[name].javascript.local;
            return { name: name, path: path };
        });
    },
    getProxyUrlsInDevelopment: function(){
        var result = [];
        for(var name in libsConfiguration) {
            var libs = libsConfiguration[name];
            if(libs.javascript !== undefined) {
                result.push({ url: '/javascripts/' + name + '.js', file: libs.javascript.local });
            }

            if(libs.stylesheet !== undefined) {
                result.push({ url: '/stylesheets/' + name + '.css', file: libs.stylesheet.local });
            }

            if(libs.resources !== undefined) {
                result.push({ url: libs.resources.url, directory: libs.resources.path });
            }
        }

        return result;
    },
    getCdnStylesheets: function(){
        var result = [];
        for(var name in libsConfiguration) {
            var libs = libsConfiguration[name];
            if(libs.stylesheet !== undefined) {
                result.push(libs.stylesheet.dist);
            }
        }

        return result;
    },
    getCdnJavascripts: function(){
        var names = getExternalJavascriptNames();
        return _.map(names, function(name){
            return libsConfiguration[name].javascript.dist;
        });
    },
    getPublicDirectoryInDevelopment: function(){
        return directoriesConfiguration.public.dev;
    },
    getPublicDirectoryInProduction: function(){
        return directoriesConfiguration.public.dist;
    },
    getApplicationVersion: function(){
        return configuration.version;
    }
};
