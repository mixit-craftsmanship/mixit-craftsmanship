var should = require('should');
var api = require('../../libs/api');
var nock = require('nock');

describe('Given I am a user of Api module', function () {
    before(function () {
        nock.disableNetConnect();
    });

    var mockApiGet = function () {
        return nock('http://www.mix-it.fr').get('/api/talks');
    };

    var result;

    var callGetApi = function () {
        result = api.get("www.mix-it.fr", "/api/talks");
    };

    describe("When I call GET on api", function () {
        var expected = { title: "Joe" };
        before(function() {
            mockApiGet().reply(200, expected);
            callGetApi();
        });
        it('should return json', function (done) {
            result.then(function (response) {
                response.title.should.equal(expected.title);
                done();
            }).catch(done);
        });
    });

    describe("When I call GET on url not returning JSON", function() {
        before(function(){
            mockApiGet().reply(200, "html");
            callGetApi();
        });
        it('should raise error', function (done) {
            result.then(function () {
                done(false);
            }).catch(function () {
                done();
            });
        });
    });

    describe('When I call GET on an unknown url', function() {
        before(function(){
            mockApiGet().reply(400, "");
            callGetApi();
        });
        it('should raise error', function (done) {
            result.then(function () {
                done(false);
            }).catch(function () {
                done();
            });
        });
    });

    describe('When I call GET url returning error (500)', function() {
        before(function(){
            mockApiGet().reply(500, "");
            api.get("www.mix-it.fr", "/api/talks");
        });
        it('should raise error', function (done) {
            result.then(function () {
                done(false);
            }).catch(function () {
                done();
            });
        });
    });
});