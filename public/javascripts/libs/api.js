define(['jquery'], function ($) {
    return {
        currentTalks: function(){
            return $.get("/api/talks/current");
        },
        nextTalks: function(){
            return $.get("/api/talks/next");
        },
        getTalk: function(id){
            return $.get("/api/talks/" + id);
        },
        applicationVersion: function(){
            return $.get("/api/applicationVersion");
        }
    };
});
