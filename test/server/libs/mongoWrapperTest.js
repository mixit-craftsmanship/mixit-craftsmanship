var mongoWrapper = require('../../../libs/mongoWrapper');
var mongoClient = require('mongodb').MongoClient;
var configuration = require('../../../libs/globalConfiguration').mongo;

describe('Mongo wrapper', function() {
    var oldMongoClient = mongoClient.connect;
    var oldConfigurationIsEnabled = configuration.isEnabled;
    var oldConfigurationGetUri = configuration.getUri;
    after(function () {
        mongoClient.connect = oldMongoClient;
        configuration.isEnabled = oldConfigurationIsEnabled;
        configuration.getUri = oldConfigurationGetUri;
    });

    var called = false;
    beforeEach(function() {
        configuration.isEnabled = function() { return true; };
        configuration.getUri = function() { return 'mongodb://localhost/mixit'; };

        called = false;
        mongoClient.connect = function(){
            called = true;
        };
    });

    it('When insert without items Then not insert in database', function () {
        mongoWrapper.insertItems('collectionA', []);

        called.should.be.false;
    });

    it('Given disable in configuration When insert Then not insert in database', function () {
        configuration.isEnabled = function() { return false; };

        mongoWrapper.insertItems('collectionA', [5, 6]);

        called.should.be.false;
    });

    it('When insert with data Then connect at database', function () {
        var uriUsed;
        mongoClient.connect = function(uri){
            uriUsed = uri;
        };

        mongoWrapper.insertItems('collectionA', [5, 6]);

        uriUsed.should.equal(configuration.getUri());
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

        mongoWrapper.insertItems('collectionA', [5, 6]);

        collectionUsed.should.equal('collectionA');
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

        mongoWrapper.insertItems('collectionA', [5, 6]);

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

        mongoWrapper.insertItems('collectionA', { item1: "hello", item2: "hello2" });

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

        mongoWrapper.insertItems('collectionA', { item1: "hello", item2: "hello2" });

        addedItemsNb.should.equal(2);
    });

    it('When insert without collection name Then raise exception', function () {
        (function() {
            mongoWrapper.insertItems('collectionA', [5,6]);
        }).should.throw;
    });
});
