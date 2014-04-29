var mongoWrapper = require('../../../libs/mongoWrapper');
var mongoClient = require('mongodb').MongoClient;

describe('Mongo wrapper', function() {
    var oldMongoClient = mongoClient.connect;
    after(function () {
        mongoClient.connect = oldMongoClient;
    });

    var called = false;
    before(function(){
        mongoClient.connect = function(){
            called = true;
        };
    });

    var configuration;
    beforeEach(function() {
        configuration = {
            collection: 'talkVole',
            uri: 'mongodb://localhost/mixit',
            enabled: true
        };

        called = false;
        mongoWrapper.configuration(configuration);
    });

    it('When insert without items Then not insert in database', function () {
        mongoWrapper.insertItems([]);

        called.should.be.false;
    });

    it('Given disable in configuration When insert Then not insert in database', function () {
        configuration.enabled = false;

        mongoWrapper.insertItems([5, 6]);

        called.should.be.false;
    });

    it('When insert with data Then connect at database', function () {
        var uriUsed;
        mongoClient.connect = function(uri){
            uriUsed = uri;
        };

        mongoWrapper.insertItems([5, 6]);

        uriUsed.should.equal(configuration.uri);
    });

    it('When connect Then open good collection', function () {
        var collectionUsed;
        mongoClient.connect = function(uri, callback){
            callback(undefined, {
                collection: function(collectionName){
                    collectionUsed = collectionName;
                }
            })
        };

        mongoWrapper.insertItems([5, 6]);

        collectionUsed.should.equal(configuration.collection);
    });

    it('When insert array Then insert in collection each items', function () {
        var itemsAdded = [];
        mongoClient.connect = function(uri, callback){
            callback(undefined, {
                collection: function(){
                    return {
                        insert: function(item){
                            itemsAdded.push(item);
                        }
                    }
                }
            })
        };

        mongoWrapper.insertItems([5, 6]);

        itemsAdded.should.containEql(5);
        itemsAdded.should.containEql(6);
    });

    it('When insert object Then insert in collection each properties', function () {
        var itemsAdded = [];
        mongoClient.connect = function(uri, callback){
            callback(undefined, {
                collection: function(){
                    return {
                        insert: function(item){
                            itemsAdded.push(item);
                        }
                    }
                }
            })
        };

        mongoWrapper.insertItems({ item1: "hello", item2: "hello2" });

        itemsAdded.should.containEql("hello");
        itemsAdded.should.containEql("hello2");
    });

    it('When insert Then close connection after', function (done) {
        var closed = false;
        var addedItemsNb = 0;
        mongoClient.connect = function(uri, callback){
            callback(undefined, {
                collection: function(){
                    return {
                        insert: function(item, endCallback){
                            addedItemsNb++;
                            closed.should.be.false;
                            endCallback();
                        }
                    }
                },
                close: function(){
                    closed = true;
                    done();
                }
            })
        };

        mongoWrapper.insertItems({ item1: "hello", item2: "hello2" });

        addedItemsNb.should.equal(2);
    });
});
