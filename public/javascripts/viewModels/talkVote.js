define(['knockout'], function (ko) {
    var viewmodel = function(talkId, talkTitle){
        var self = this;

        self.templateName = "talkVoteTemplate";
        self.talkId = talkId;
        self.talkTitle = talkTitle;

        self.happyLevel = ko.observable(0);

        self.vote = function(){
            self.happyLevel(self.happyLevel() + 1);
        };
    };

    return {
        create: function(talkId, talkTitle){
            return new viewmodel(talkId, talkTitle);
        }
    };
});
