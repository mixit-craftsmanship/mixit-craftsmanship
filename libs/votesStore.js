var mongoWrapper = require('./mongoWrapper');
var promise = require('promise');
var timerFactory = require('./timer');
var mongoConfiguration = require('./globalConfiguration').mongo;

var storeTimer;
var votes = {};

var store = function(){
    var oldVotes = votes;
    votes = {};
    mongoWrapper.insertItems(mongoConfiguration.getTalkVotesCollectionName(), oldVotes);
};

var generateItem = function(talkId){
    var now = new Date();
    var item = {
        talkId: talkId,
        minute: now.getMinutes(),
        hour: now.getHours(),
        second: (now.getSeconds()/5|0)*5,
        day: now.getDate()
    };
    item.key = item.talkId + '-' + item.minute + '-' + item.hour + '-' + item.second + '-' + item.day;

    return item;
};

exports.save = function(talkId, votesNb){
    var item = generateItem(talkId);
    var key = item.key;
    if(votes[key] === undefined){
        votes[key] = item;
        votes[key].nb = 0;
    }

    votes[key].nb += votesNb;
};

exports.configuration = function(storeDelay){
    if(storeTimer !== undefined){
        storeTimer.stop();
    }

    storeTimer = timerFactory.create(storeDelay, store);
    storeTimer.start();
};
