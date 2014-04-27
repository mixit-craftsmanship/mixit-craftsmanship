define(['knockout', 'libs/timer'], function (ko, timerFactory) {
    var viewmodel = function(talkId, talkTitle){
        var self = this;

        self.templateName = "talkVoteTemplate";
        self.talkId = talkId;
        self.talkTitle = talkTitle;

        self.happyLevel = ko.observable(0);

        var clickNb = 0;

        var updateHappyLevel = function(){
            if(clickNb > 8) self.happyLevel(5);
            else if(clickNb > 6) self.happyLevel(4);
            else if(clickNb > 4) self.happyLevel(3);
            else if(clickNb > 1) self.happyLevel(2);
            else if(clickNb == 1) self.happyLevel(1);
            else self.happyLevel(0);

            clickNb = Math.floor(clickNb / 2);
        };

        var timer = timerFactory.create(500, updateHappyLevel);

        self.vote = function(){
            if(clickNb <= 0) {
                timer.restart();
                self.happyLevel(1);
            }

            clickNb++;
        };
    };

    return {
        create: function(talkId, talkTitle){
            return new viewmodel(talkId, talkTitle);
        }
    };
});
