'use strict';

var pathHelpers = require('./pathHelpers');
var cheerio = require('cheerio');
var es = require('event-stream');
var fs = require('fs');

module.exports.inject = function(homeFullPath) {
    return es.map(function(file, gulpCallback) {
        var templateName  = pathHelpers.getFileNameWithoutExtension(file) + "Template";
        var templateContent = file.contents.toString();

        var homeContent = fs.readFileSync(homeFullPath, 'utf-8');

        var $ = cheerio.load(homeContent);
        $('script[id='+templateName+']').remove();
        $('body').append(templateContent);

        fs.writeFileSync(homeFullPath, $.html(), 'utf-8');

        gulpCallback(null, file);
    });
};
