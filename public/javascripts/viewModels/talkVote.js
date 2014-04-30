define(['knockout', 'libs/timer', 'libs/voteSender', 'libs/api'], function (ko, timerFactory, voteSender, api) {
    var viewmodel = function(talkId, talkTitle){
        var self = this;

        self.templateName = "talkVoteTemplate";
        self.talkId = talkId;
        self.talkTitle = talkTitle;

        self.hasError = ko.observable(false);
        self.connected = ko.observable(false);
        self.talkEnded = ko.observable(false);
        self.happyLevel = ko.observable(0);

	    self.loading = ko.observable(true);
	    self.talkSummary = ko.observable();
	    self.talkDay = ko.observable();
	    self.talkStart = ko.observable();
	    self.talkEnd = ko.observable();
	    self.talkRoom = ko.observable();
	    self.talkSpeakers = ko.observableArray();
	    self.talkHasStartAndEnd = ko.observable(true);

        var voteNb = 0;

        var updateHappyLevel = function(){
            if(voteNb > 8) self.happyLevel(5);
            else if(voteNb > 6) self.happyLevel(4);
            else if(voteNb > 4) self.happyLevel(3);
            else if(voteNb > 1) self.happyLevel(2);
            else if(voteNb == 1) self.happyLevel(1);
            else self.happyLevel(0);

            voteNb = Math.floor(voteNb / 2);
        };

        var timer = timerFactory.create(500, updateHappyLevel);

	    api.getTalk(talkId).done(function(talk){
		    self.loading(false);
		    self.talkSummary(talk.summary);
		    if(talk.start === undefined || talk.end === undefined) {
			    self.talkHasStartAndEnd(false);
		    } else {
			    var start = new Date(talk.start);
			    self.talkDay(start.getDate() + "/" + (start.getMonth() + 1));
			    self.talkStart(start.getHours() + ":" + zeroFill(start.getMinutes(), 2));
			    var end = new Date(talk.end);
			    self.talkEnd(end.getHours() + ":" + end.getMinutes());
		    }
		    self.talkRoom(talk.room);
		    self.talkSpeakers(talk.speakers);
	    });

        self.vote = function(){
            if(!voteSender.isEnabled()){
                self.hasError(true);
                return;
            }

            if(voteNb <= 0) {
                timer.restart();
                self.happyLevel(1);
            }

            voteNb++;
            voteSender.send(talkId);
        };

        voteSender.enable().done(function(){
            self.connected(true);
        }).fail(function(){
            self.hasError(true);
        });

        voteSender.onTalkEnded(function(){
            self.talkEnded(true);
        });

        self.dispose = function(){
            timer.stop();
            voteSender.disable();
        };
    };

	function zeroFill(number, width)
	{
		width -= number.toString().length;
		if ( width > 0 )
		{
			return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
		}
		return number + ""; // always return a string
	}

    return {
        create: function(talkId, talkTitle){
            return new viewmodel(talkId, talkTitle);
        }
    };
});
