var mongoClient = require('mongodb').MongoClient;
var promise = require('promise');
var timerFactory = require('./timer');

var storeTimer;
var votes = {};

var configuration = {
    collection: 'talkVole',
    uri: 'mongodb://localhost/mixit',
    delay: 10000
};

var insertInCollection = function(collection, item){
    return new promise(function(resolve, reject){
        collection.insert(item, function(){
            resolve(item.key);
        });
    });
};

var pushToMongo = function(votesToSaved){
    var hasItems;

    for(var key in votesToSaved){
        hasItems = true;
        break;
    }

    if(!hasItems) {
        return;
    }

    mongoClient.connect(configuration.uri, function(err, db) {
        if(err) throw err;

        var collection = db.collection(configuration.collection);

        var promises = [];
        for(var key in votesToSaved){
            promises.push(insertInCollection(collection, votesToSaved[key]));
        }

        promise.all(promises).then(function(){
            db.close();
        });
    });
};

var store = function(){
    var oldVotes = votes;
    votes = {};
    pushToMongo(oldVotes);
};

var generateItem = function(talkId){
    var now = new Date();
    var item = {
        talkId: talkId,
        minute: now.getMinutes(),
        hour: now.getHours(),
        second: (now.getSeconds()/5|0)*5,
        day: now.getDay()
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

exports.configuration = function(uri){
    configuration.uri = uri;

    storeTimer = timerFactory.create(configuration.delay, store);
    storeTimer.start();
};
