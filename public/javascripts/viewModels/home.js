define(['knockout', 'libs/api'], function (ko, api) {
    var talkViewModel = function(id, title, description, navigation){
        var self = this;

        self.id = id;
        self.title = title;
        self.description = description;

        self.select = function(){
            console.log(description);
            navigation.displayTalkVotePage(id, title, description);
        };
    };

    var viewmodel = function(navigation){
        var self = this;

        self.templateName = "homeTemplate";

        self.talks = ko.observableArray();
        self.waiting = ko.observable(true);

        api.currentTalks().done(function(result){
            var talkViewModels = ko.utils.arrayMap(result, function(item){
                return new talkViewModel(item.id, item.title, item.description, navigation);
            });
            self.talks(talkViewModels);

            self.waiting(false);
        });
    };

    return {
        create: function(navigation){
            return new viewmodel(navigation);
        }
    };
});
