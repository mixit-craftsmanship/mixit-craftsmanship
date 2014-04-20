'use strict';

var clientConfig = {
    directory: 'public/',
    build: {
        directory: 'public/build/',
        javascriptFileName: 'app.min.js',
        cssFileName: 'app.min.css',
        templateFileName: 'templates.html'
    },
    cssDirectory: 'public/stylesheets/',
    javascriptsDirectory: 'public/javascripts/',
    templatesDirectory: 'public/templates/',
    testsDirectory: 'test/public/',
    homePage: 'index.html'
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
    getHomePath: function(){
        return clientConfig.directory + clientConfig.homePage;
    },
    getHtmlFilesPattern: function(){
        return [ this.getHomePath(), this.getTemplateFilesPattern() ];
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
}