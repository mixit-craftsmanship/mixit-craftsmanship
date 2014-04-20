define(['jquery'], function ($) {
    return {
        currentTalks: function(){
            return $.get("/api/talks/current");
        }
    };
});