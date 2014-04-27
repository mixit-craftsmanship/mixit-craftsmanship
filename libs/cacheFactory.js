var promise = require('promise');

var cache = function () {
    var self = this;

    var data = {};

    self.getOrExecute = function (key, func) {
        return new promise(function (resolve) {
            var value = data[key];
            if (value !== undefined) {
                resolve(value);
                return;
            }

            resolve(func());
        }).then(function (result) {
            data[key] = result;
            return result;
        });
    };

    self.clean = function (key) {
        data[key] = undefined;
    };
};

exports.create = function () {
    return new cache();
};