'use strict';

var pathHelpers = require('./pathHelpers');
var es = require('event-stream');

module.exports.wrap = function() {
    return es.map(function(file, gulpCallback) {
        var fileName  = pathHelpers.getFileNameWithoutExtension(file);

        file.contents = Buffer.concat([
            new Buffer('<script type="text/template" id="' + fileName + 'Template">'),
            file.contents,
            new Buffer('</script>')
        ]);

        gulpCallback(null, file);
    });
};
