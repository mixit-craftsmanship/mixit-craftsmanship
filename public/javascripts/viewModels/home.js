define(['knockout', 'libs/api'], function (ko, api) {
    var talkViewModel = function(id, title, navigation){
        var self = this;

        self.id = id;
        self.title = title;

        self.select = function(){
            navigation.displayTalkVotePage(id, title);
        };

        self.viewDetails = function(){
            navigation.displayTalkDetail(id, title);
        };
    };

    var viewmodel = function(navigation){
        var self = this;

        self.templateName = "homeTemplate";

        self.talks = ko.observableArray();
        self.nextTalks = ko.observableArray();
        self.waiting = ko.observable(true);

        api.currentTalks().done(function(result){
            var talkViewModels = ko.utils.arrayMap(result, function(item){
                return new talkViewModel(item.id, item.title, navigation);
            });
            self.talks(talkViewModels);

            self.waiting(false);
        });

        api.nextTalks().done(function(result){
            var nextTalkViewModels = ko.utils.arrayMap(result, function(item){
                return new talkViewModel(item.id, item.title, navigation);
            });
            self.nextTalks(nextTalkViewModels);
        });
    };

    return {
        create: function(navigation){
            return new viewmodel(navigation);
        }
    };
});
