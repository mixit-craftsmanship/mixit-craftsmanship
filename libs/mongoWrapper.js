var mongoClient = require('mongodb').MongoClient;
var promise = require('promise');

var configuration = {
    collection: 'talkVole',
    uri: 'mongodb://localhost/mixit',
    enabled: false
};

exports.configuration = function(config){
    configuration = config;
};

var insertInCollection = function(collection, item){
    return new promise(function(resolve){
        collection.insert(item, function(){
            resolve(item.key);
        });
    });
};

var hasItems = function(items){
    for(var key in items){
        return true;
    }

    return false;
};

var connectAndInsert = function(items){
    if(!hasItems(items)) {
        return;
    }

    mongoClient.connect(configuration.uri, function(err, db) {
        if(err) throw err;

        var collection = db.collection(configuration.collection);

        var promises = [];
        for(var key in items){
            promises.push(insertInCollection(collection, items[key]));
        }

        promise.all(promises).then(function(){
            db.close();
        }).catch(function(){
            db.close();
        });
    });
};

exports.insertItems = function(items){
    if(!configuration.enabled){
        return;
    }

    connectAndInsert(items);
};