'use strict';
var globalConfiguration = require('../libs/globalConfiguration');

var clientConfig = {
    directory: 'public/',
    build: {
        directory: 'publicBuild/',
        javascriptFileName: 'application.build.min.js',
        cssFileName: 'app.min.css',
        templateFileName: 'templates.html',
        requireJsUrl: 'http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.11/require.min.js'
    },
    requireMainModule: 'application.build',
    cssDirectory: 'public/stylesheets/',
    javascriptsDirectory: 'public/javascripts/',
    templatesDirectory: 'public/templates/',
    testsDirectory: 'test/public/',
    layout: 'layout.html',
    homePage: 'index.html',
    staticFileExtensions: ['txt', 'gif', 'png', 'jpg', 'ico']
};

var serverConfig = {
    javascriptsDirectory: 'libs/',
    testsDirectory: 'test/libs/',
    cover: {
        tempDirectory: 'debug',
        output: 'coverage.html'
    }
};

var htmlPattern = "**/*.html";
var lessPattern = "**/*.less";
var jsPattern = "**/*.js";
var cssPattern = "**/*.css";

exports.client = {
    getJavascriptFilesPattern: function(){
        return clientConfig.javascriptsDirectory + jsPattern;
    },
    getTemplateFilesPattern: function(){
        return clientConfig.templatesDirectory + htmlPattern;
    },
    getLayoutPath: function(){
        return clientConfig.directory + clientConfig.layout;
    },
    getHomePath: function(){
        return clientConfig.directory + clientConfig.homePage;
    },
    getHomeFileName: function(){
        return clientConfig.homePage;
    },
    getBuildedHomePath: function(){
        return clientConfig.build.directory + clientConfig.homePage;
    },
    getHtmlFilesPattern: function(){
        return [ this.getLayoutPath(), this.getTemplateFilesPattern() ];
    },
    getDirectory: function(){
        return clientConfig.directory;
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
    getBuildTemplateFileName: function(){
        return clientConfig.build.templateFileName;
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
        return [serverConfig.javascriptsDirectory + jsPattern, serverConfig.testsDirectory + jsPattern];
    },
    getTestFilesPattern: function(){
        return serverConfig.testsDirectory + jsPattern;
    },
    getTestDirectory: function(){
        return serverConfig.testsDirectory;
    },
    getJavascriptFilesPattern: function(){
        return [serverConfig.javascriptsDirectory + jsPattern];
    },
    getCoverTempDirectory: function(){
        return serverConfig.cover.tempDirectory;
    },
    getCoverOutput: function(){
        return serverConfig.cover.output;
    }
};

exports.getAllJavascriptFilesPattern = function(){
    return [
            serverConfig.javascriptsDirectory + jsPattern,
            serverConfig.testsDirectory + jsPattern,
            clientConfig.javascriptsDirectory + jsPattern,
            clientConfig.testsDirectory + jsPattern,
            'app.js'
    ];
};