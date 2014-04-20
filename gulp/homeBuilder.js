'use strict';

var cheerio = require('gulp-cheerio');
var fs = require('fs');
var crypto = require('crypto');

var defaultConfiguration = {
    cssFileName: 'app.min.css',
    javascriptFileName: 'app.min.js',
    templatesFileName: 'templates.html',
    outputDirectory: 'public/build/'
};

var configuration = defaultConfiguration;

exports.configure = function(config) {
    configuration = config;
};

exports.injectBuildedCss = function(){
    return cheerio(function ($) {
        $('link:not([attr^=http])').remove();
        $('head').append('<link rel="stylesheet" href="'+ configuration.cssFileName +'">');
    });
};

exports.injectBuildedJs = function(){
    return cheerio(function ($) {
        $('script:not([attr^=http])').remove();
        $('body').append('<script src="'+ configuration.javascriptFileName +'"></script>');
    });
};

exports.injectBuildedTemplates = function(){
    return cheerio(function ($) {
        $('script[type="text/template"]').remove();
        var templates = fs.readFileSync(configuration.outputDirectory + configuration.templatesFileName, 'utf-8');
        $('body').append(templates);
    });
};

var computeFileVersion = function(file){
    var content = fs.readFileSync(file);
    return crypto.createHash("md5").update(content).digest('hex');
};

var addVersionOnLink = function($element, attributName){
    var file = $element.attr(attributName);
    if(file == undefined || file.indexOf("http") == 0) {
        return;
    }

    var suffix = computeFileVersion(configuration.outputDirectory + file);
    $element.attr(attributName, file + "?v=" + suffix);
};

exports.addVersionOnFilesIncluded = function(){
    return cheerio(function ($) {
        $('link').each(function () {
            addVersionOnLink($(this), 'href');
        });
        $('script').each(function () {
            addVersionOnLink($(this), 'src');
        });
    });
};
