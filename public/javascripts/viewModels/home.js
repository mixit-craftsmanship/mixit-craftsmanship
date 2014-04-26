define(['knockout', 'libs/api'], function (ko, api) {
    var viewmodel = function(){
        var self = this;

        self.templateName = "currentTalksTemplate";

        self.talks = ko.observableArray();
        self.waiting = ko.observable(true);

        api.currentTalks().done(function(result){
            self.talks(result);
        });
    };

    return {
        create: function(){
            return new viewmodel();
        }
    };
});
