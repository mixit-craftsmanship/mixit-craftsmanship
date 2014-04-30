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

var connectAndInsert = function (collectionName, items) {
    if (!hasItems(items)) {
        return;
    }

    mongoClient.connect(configuration.getUri(), function (err, db) {
        if (err) throw err;

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

exports.queryStats = function (collectionName) {
    mongoClient.connect(configuration.getUri(), function (err, db) {
        if (err) throw err;

        var collection = db.collection(collectionName);

        return collection.aggregate([
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

                                "$minute"
                                ,
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
        ]);
    });
};