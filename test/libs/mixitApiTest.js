var mixitApi = require('../../libs/mixitApi');
var nock = require('nock');

describe('Mix-IT Api module', function() {
    before(function () {
        nock.disableNetConnect();
    });

    it('When get talks should return talks list', function (done) {
        var result = [{"id":540,"title":"Biotech breaks free!","summary":"Current trends in biotech are bringing new ways of interacting with living matters. Let\u0027s talk about one of those trends: biohacking. ","description":"Thomas is the co-founder and president of the nonprofit organization \"La Paillasse\" in Paris, one of the world\u0027s largest community laboratories, commonly called hackerspaces, that foster open access and open source biotechnologies. He is an active member of the Do-it-yourself Biology (DIYbio) community, organizing the launch of DIYbio Europe, and working regularly as one of its spokespersons. Convinced that the 21st century will be the century of biotechnologies, he has been focusing on making biology more accessible to use as a technology for citizens and amateurs, developing cheap genetic diagnostic and creative use of biomaterials. He is currently finishing his Synthetic Biology PhD studies at iSSB, a CNRS-Genopole research institution.","language":"en","interests":[831,828,826,829,830,808,827],"speakers":[1066],"format":"Keynote","level":"Beginner","start":"2014-04-29T09:15:00.000+02:00","end":"2014-04-29T09:40:00.000+02:00","room":"Grand Amphi"}];
        nock('http://www.mix-it.fr').get('/api/talks').reply(200, result);

        mixitApi.talks().then(function(result){
            result.should.have.length(1);
            done();
        }).catch(done);
    });

    it('When get talks should return talks list of cache', function (done) {
        var result = [{"id":540}];
        nock('http://www.mix-it.fr').get('/api/talks').reply(200, result);

        mixitApi.talks().then(function(){
            nock('http://www.mix-it.fr').get('/api/talks').reply(200, []);
            return mixitApi.talks();
        }).then(function(result){
            result.should.have.length(1);
            done();
        }).catch(done);
    });
});