define(['knockout', 'libs/api'], function (ko, api) {
    var viewmodel = function (talkId, talkTitle) {
        var self = this;

        self.templateName = "talkDetailTemplate";
        self.talkId = talkId;
        self.talkTitle = talkTitle;

        self.loading = ko.observable(true);
        self.talkSummary = ko.observable();
        self.talkDay = ko.observable();
        self.talkStart = ko.observable();
        self.talkEnd = ko.observable();
        self.talkRoom = ko.observable();
        self.talkSpeakers = ko.observableArray();
        self.talkHasStartAndEnd = ko.observable(true);

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