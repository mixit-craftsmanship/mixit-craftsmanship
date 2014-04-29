var api = require('./apiClient');
var cache = require('./cacheFactory').create();

var get = function(path){
    return api.get("www.mix-it.fr", path);
};

exports.talks = function(){
    return cache.getOrExecute("talks", function(){
        return get("/api/talks");
    });
};

exports.talk = function (talkId) {
    return cache.getOrExecute("talk" + talkId, function() {
        return get("/api/talks/" + talkId + "?details=true")
    })
};
