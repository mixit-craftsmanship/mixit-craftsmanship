define(['jquery'], function ($) {
    return {
        currentTalks: function(){
            return $.get("/api/talks/current");
        },
        applicationVersion: function(){
            return $.get("/api/applicationVersion");
        }
    };
});