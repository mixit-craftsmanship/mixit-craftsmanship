'use strict';
var globalConfiguration = require('../libs/globalConfiguration');

var clientConfig = {
    directory: globalConfiguration.client.getPublicDirectoryInDevelopment(),
    build: {
        directory: globalConfiguration.client.getPublicDirectoryInProduction(),
        javascriptFileName: 'application.build.min.js',
        cssFileName: 'app.min.css',
        requireJsUrl: 'http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js'
    },
    requireMainModule: 'application.build',
    cssDirectory: 'public/stylesheets/',
    javascriptsDirectory: 'public/javascripts/',
    testsDirectory: 'test/public/',
    staticFileExtensions: ['txt', 'gif', 'png', 'jpg', 'ico']
};

var serverConfig = {
    javascriptsDirectory: ['libs/', 'routes/'],
    testsDirectory: 'test/server/',
    cover: {
        tempDirectory: 'debug',
        output: 'coverage.html'
    }
};

var lessPattern = "**/*.less";
var jsPattern = "**/*.js";
var cssPattern = "**/*.css";

exports.client = {
    getJavascriptFilesPattern: function(){
        return clientConfig.javascriptsDirectory + jsPattern;
    },
    getLayoutPattern: function(){
        return clientConfig.directory + '*.html';
    },
    getHomePage: function(){
        return clientConfig.directory + 'index.html';
    },
    getStatsPage: function(){
        return clientConfig.directory + 'stats.html';
    },
    getHtmlFilesPattern: function(){
        return [ this.getLayoutPattern() ];
    },
    getCssDirectory: function(){
        return clientConfig.cssDirectory;
    },
    getCssFilesPattern: function(){
        return clientConfig.cssDirectory + cssPattern;
    },
    getLessFilesPattern: function(){
        return clientConfig.cssDirectory + lessPattern;
    },
    getBuildCssFileName: function(){
        return clientConfig.build.cssFileName;
    },
    getBuildJavascriptFileName: function(){
        return clientConfig.build.javascriptFileName;
    },
    getBuildDirectory: function(){
        return clientConfig.build.directory;
    },
    getRequireJsUrl: function(){
        return clientConfig.build.requireJsUrl;
    },
    getRequireMainModule: function(){
        return clientConfig.requireMainModule;
    },
    getStaticFilesPattern: function(){
        var patterns = [];
        var extensions = clientConfig.staticFileExtensions;
        var prefix = clientConfig.directory + '**/*.';
        for(var key in extensions){
            patterns.push(prefix + extensions[key]);
        }
        return patterns;
    },
    getExternalLibNames: function(){
        return globalConfiguration.client.getExternalJavascriptNames();
    },
    getCdnStylesheets: function(){
        return globalConfiguration.client.getCdnStylesheets();
    },
    getCdnJavascripts: function(){
        return globalConfiguration.client.getCdnJavascripts();
    }
};

exports.server = {
    getAllJavascriptFilesPattern: function(){
        var result = [serverConfig.testsDirectory + jsPattern];

        for(var key in serverConfig.javascriptsDirectory){
            result.push(serverConfig.javascriptsDirectory[key] + jsPattern);
        }

        return result;
    },
    getTestFilesPattern: function(){
        return serverConfig.testsDirectory + jsPattern;
    },
    getTestDirectory: function(){
        return serverConfig.testsDirectory;
    },
    getJavascriptFilesPattern: function(){
        var result = [];

        for(var key in serverConfig.javascriptsDirectory){
            result.push(serverConfig.javascriptsDirectory[key] + jsPattern);
        }

        return result;
    },
    getCoverTempDirectory: function(){
        return serverConfig.cover.tempDirectory;
    },
    getCoverOutput: function(){
        return serverConfig.cover.output;
    }
};

exports.getAllJavascriptFilesPattern = function(){
    var result = [
        serverConfig.testsDirectory + jsPattern,
        clientConfig.javascriptsDirectory + jsPattern,
        clientConfig.testsDirectory + jsPattern,
        'app.js'
    ];

    for(var key in serverConfig.javascriptsDirectory){
        result.push(serverConfig.javascriptsDirectory[key] + jsPattern);
    }

    return result;
};

exports.getAllJavascriptFilesWithoutTestsPattern = function(){
    var result = [
        clientConfig.javascriptsDirectory + jsPattern,
        'app.js'
    ];

    for(var key in serverConfig.javascriptsDirectory){
        result.push(serverConfig.javascriptsDirectory[key] + jsPattern);
    }

    return result;
};