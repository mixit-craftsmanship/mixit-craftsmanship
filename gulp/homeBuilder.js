'use strict';

var cheerio = require('gulp-cheerio');
var fs = require('fs');
var crypto = require('crypto');
var configuration = require('./configuration').client;

exports.injectBuildedCss = function(){
    return cheerio(function ($) {
        $('link:not([attr^=http])').remove();
        $('head').append('<link rel="stylesheet" href="'+ configuration.getBuildCssFileName() +'">');
    });
};

exports.injectBuildedJs = function(){
    return cheerio(function ($) {
        $('script:not([attr^=http])').remove();
        var moduleName = configuration.getRequireMainModule();
        var requireUrl = configuration.getRequireJsUrl();
        $('body').append('<script data-main="' + moduleName + '" src="' + requireUrl + '"></script>');
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
        $('link').each(function () {
            addVersionOnLink($(this), 'href');
        });
        $('script').each(function () {
            addVersionOnLink($(this), 'src');
        });
    });
};
