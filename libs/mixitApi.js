var api = require('./api');

var get = function(path){
    return api.get("www.mix-it.fr", path);
};

exports.talks = function(){
    return get("/api/talks");
};
