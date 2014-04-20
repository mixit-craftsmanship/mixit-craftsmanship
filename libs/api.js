var http = require('http');
var Promise = require('promise');

var httpPromised = function(host, url, method){
    return new Promise(function (resolve, reject) {
        var request = http.get({
            host: host,
            path: url,
            method: method
        }, function(response){
            response.setEncoding('utf-8');

            var responseString = '';

            response.on('data', function(data) {
                responseString += data;
            });

            response.on('end', function() {
                try {
                    var responseObject = JSON.parse(responseString);
                    resolve(responseObject);
                }
                catch (exception)
                {
                    reject(exception);
                }
            });
        });

        request.on('error', function(error){
            reject(error);
        });
    });
};

exports.get = function(host, url){
    return httpPromised(host, url, 'GET');
};

