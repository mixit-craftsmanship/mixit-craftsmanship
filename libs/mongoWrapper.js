var mongoClient = require('mongodb').MongoClient;
var configuration = require('./globalConfiguration').mongo;
var promise = require('promise');

var insertInCollection = function (collection, item) {
    return new promise(function (resolve) {
        collection.insert(item, function () {
            resolve(item.key);
        });
    });
};

var hasItems = function (items) {
    for (var key in items) {
        return true;
    }

    return false;
};

var connect = function(callback){
    mongoClient.connect(configuration.getUri(), function(err, db){
        if(err) throw err;

        callback(db);
    });
};

var connectAndInsert = function(collectionName, items){
    if(!hasItems(items)) {
        return;
    }

    connect(function(db) {
        var collection = db.collection(collectionName);

        var promises = [];
        for (var key in items) {
            promises.push(insertInCollection(collection, items[key]));
        }

        promise.all(promises).then(function () {
            db.close();
        }).catch(function () {
            db.close();
        });
    });
};

exports.insertItems = function (collectionName, items) {
    if (!configuration.isEnabled()) {
        return;
    }

    if (!collectionName) {
        throw 'Collection name cannot empty';
    }

    connectAndInsert(collectionName, items);
};

exports.getVoteStatistiques = function (collectionName) {
    return new promise(function(resolve, reject){
        connect(function (db) {
            var collection = db.collection(collectionName);

            collection.aggregate([
                {
                    $project: {
                        talkId: 1,
                        nb: 1,
                        day: 1,
                        hour: 1,
                        "minutesRange": {
                            "$subtract": [
                                "$minute",
                                {"$mod": [
                                    "$minute",
                                    20
                                ]}
                            ]
                        }
                    }
                },
                {
                    $group: {
                        _id: { day: "$day", hour: "$hour", minutesRange: "$minutesRange", talkId: "$talkId" },
                        total: {$sum: "$nb"}
                    }
                },
                {
                    $group: {
                        _id: { day: "$_id.day", hour: "$_id.hour", minutes: "$_id.minutesRange"},
                        talks: { $push: { talkId: "$_id.talkId", total: "$total"}}
                    }
                },
                {
                    $sort: {
                        "_id.day": 1, "_id.hour": 1, "_id.minutesRange": 1
                    }
                }
            ], function(err, result) {
                if(err) reject(err);
                else resolve(result);

                db.close();
            });
        });
    });
};