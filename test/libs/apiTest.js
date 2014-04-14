var assert = require("assert");
var should = require('should');
var api = require('../../libs/api');
var nock = require('nock');

describe('Api module', function() {
    before(function(){
        nock.disableNetConnect();
    });

    it('When get api should return json', function (done) {
        var result = { title: "Joe" };
        nock('http://www.mix-it.fr').get('/api/talks').reply(200, result);

        api.get("www.mix-it.fr", "/api/talks").then(function(response){
            response.title.should.equal(result.title);
            done();
        }).catch(done);
    });

    it('When get url without json should raise error', function (done) {
        nock('http://www.mix-it.fr').get('/api/talks').reply(200, "html");

        api.get("www.mix-it.fr", "/api/talks").then(function() {
            done(false);
        }).catch(function(error){
            done();
        });
    });

    it('When get unknown url should raise error', function (done) {
        nock('http://www.mix-it.fr').get('/api/talks').reply(400, "");

        api.get("www.mix-it.fr", "/api/talks").then(function() {
            done(false);
        }).catch(function(error){
            done();
        });
    });

    it('When get url with error should raise error', function (done) {
        nock('http://www.mix-it.fr').get('/api/talks').reply(500, "");

        api.get("www.mix-it.fr", "/api/talks").then(function() {
            done(false);
        }).catch(function(error){
            done();
        });
    });
});