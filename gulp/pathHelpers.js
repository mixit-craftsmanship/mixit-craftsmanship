'use strict';

var path = require('path');

module.exports.getFileNameWithoutExtension = function(file) {
    return path.basename(file.path, path.extname(file.path));
};
