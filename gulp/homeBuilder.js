'use strict';

var cheerio = require('gulp-cheerio');
var fs = require('fs');
var crypto = require('crypto');
var configuration = require('./configuration').client;

exports.injectExternalCss = function(){
    return cheerio(function ($) {
        var cdns = configuration.getCdnStylesheets();
        for(var key in cdns){
            $('head').append('<link rel="stylesheet" href="'+ cdns[key] +'">');
        }
    });
};

exports.injectBuildedCss = function(){
    return cheerio(function ($) {
        $('link[rel=stylesheet]:not([href^=http])').remove();
        $('head').append('<link rel="stylesheet" href="'+ configuration.getBuildCssFileName() +'">');
    });
};

exports.injectExternalJs = function(){
    return cheerio(function ($) {
        var cdns = configuration.getCdnJavascripts();
        for(var key in cdns){
            $('body').append('<script src="' + cdns[key] + '"></script>');
        }
    });
};

exports.injectBuildedJs = function(){
    return cheerio(function ($) {
        $('script:not([type^=text])').remove();
        var requireUrl = configuration.getRequireJsUrl();
        var javascriptUrl = configuration.getBuildJavascriptFileName();
        $('body').append('<script src="' + requireUrl + '"></script><script src="' + javascriptUrl + '"></script>');
    });
};

exports.injectBuildedTemplates = function(){
    return cheerio(function ($) {
        $('script[type="text/template"]').remove();
        var templates = fs.readFileSync(configuration.getBuildDirectory() + configuration.getBuildTemplateFileName(), 'utf-8');
        $('body').append(templates);
    });
};

var computeFileVersion = function(file){
    var content = fs.readFileSync(file);
    return crypto.createHash("md5").update(content).digest('hex');
};

var addVersionOnLink = function($element, attributName){
    var file = $element.attr(attributName);
    if(file == undefined || file.indexOf("http") == 0 || file.indexOf("//") == 0) {
        return;
    }

    var suffix = computeFileVersion(configuration.getBuildDirectory() + file);
    $element.attr(attributName, file + "?v=" + suffix);
};

exports.addVersionOnFilesIncluded = function(){
    return cheerio(function ($) {
        $('link[rel=stylesheet]').each(function () {
            addVersionOnLink($(this), 'href');
        });
        $('script').each(function () {
            addVersionOnLink($(this), 'src');
        });
    });
};
