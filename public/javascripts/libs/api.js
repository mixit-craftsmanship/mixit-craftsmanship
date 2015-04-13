define(function () {
    var ajaxGet = function(path, success) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                success(JSON.parse(xhr.responseText));
            }
        };
        xhr.open('GET', path, true);
        xhr.send();
    };

    var get = function(path){
        return {
            done: function(success) {
                ajaxGet(path, success);
            }
        };
    };

    return {
        currentTalks: function(){
            return get("/api/talks/current");
        },
        nextTalks: function(){
            return get("/api/talks/next");
        },
        getTalk: function(id){
            return get("/api/talks/" + id);
        },
        applicationVersion: function(){
            return get("/api/applicationVersion");
        }
    };
});
