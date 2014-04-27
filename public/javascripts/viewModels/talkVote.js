define(['knockout'], function (ko) {
    var viewmodel = function(talkId, talkTitle){
        var self = this;

        self.templateName = "talkVoteTemplate";
        self.talkId = talkId;
        self.talkTitle = talkTitle;

        self.vote = function(){
            console.log("+1");
        };
    };

    return {
        create: function(talkId, talkTitle){
            return new viewmodel(talkId, talkTitle);
        }
    };
});
