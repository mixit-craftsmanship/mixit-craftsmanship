var mongoClient = require('mongodb').MongoClient;
var configuration = require('./globalConfiguration').mongo;
var promise = require('promise');

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

var connectAndInsert = function(collectionName, items){
    if(!hasItems(items)) {
        return;
    }

    mongoClient.connect(configuration.getUri(), function(err, db) {
        if(err) throw err;

        var collection = db.collection(collectionName);

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

exports.insertItems = function(collectionName, items){
    if(!configuration.isEnabled()){
        return;
    }

    if(!collectionName){
        throw 'Collection name cannot empty';
    }

    connectAndInsert(collectionName, items);
};