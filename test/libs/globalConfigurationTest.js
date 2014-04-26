var should = require('should');
var api = require('../../libs/api');
var globalConfiguration = require('../../libs/globalConfiguration');

describe('Given a global configuration', function () {
    globalConfiguration.initialize({
        knockout: {
            javascript: {
                local: 'node_modules/knockout/build/output/knockout-latest.debug.js',
                dist: 'http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min.js'
            }
        },
        jquery: {
            javascript: {
                local: 'bower_components/jquery/dist/jquery.js',
                dist: 'http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js'
            }
        },
        bootstrap: {
            stylesheet: {
                local: 'bower_components/bootstrap/dist/css/bootstrap.css',
                dist: 'http://ajax.aspnetcdn.com/ajax/bootstrap/3.1.1/css/bootstrap.min.css'
            },
            resources: {
                url: '/fonts',
                path: 'bower_components/bootstrap/dist/fonts'
            }
        }
    });

    it('When getExternalJavascriptsWithLocalPath Then return all external javascripts with name as key and path as value', function () {
        var result = globalConfiguration.client.getExternalJavascriptsWithLocalPath();

        result.should.have.length(2);
        result.should.containEql({ name: 'knockout', path: 'node_modules/knockout/build/output/knockout-latest.debug.js' });
        result.should.containEql({ name: 'jquery', path: 'bower_components/jquery/dist/jquery.js' });
    });

    it('When getExternalJavascriptNames Then return all external javascript names', function () {
        var result = globalConfiguration.client.getExternalJavascriptNames();

        result.should.have.length(2);
        result.should.containEql('knockout');
        result.should.containEql('jquery');
    });

    it('When getProxyUrlsInDevelopment Then return all dev files with url and path', function () {
        var result = globalConfiguration.client.getProxyUrlsInDevelopment();

        result.should.have.length(4);
        result.should.containEql({ url: '/javascripts/knockout.js', file: 'node_modules/knockout/build/output/knockout-latest.debug.js' });
        result.should.containEql({ url: '/javascripts/jquery.js', file: 'bower_components/jquery/dist/jquery.js' });
        result.should.containEql({ url: '/stylesheet/bootstrap.css', file: 'bower_components/bootstrap/dist/css/bootstrap.css' });
        result.should.containEql({ url: '/fonts', directory: 'bower_components/bootstrap/dist/fonts' });
    });

    it('When getCdnStylesheets Then return all cdns of stylesheet libs', function () {
        var result = globalConfiguration.client.getCdnStylesheets();

        result.should.have.length(1);
        result.should.containEql('http://ajax.aspnetcdn.com/ajax/bootstrap/3.1.1/css/bootstrap.min.css');
    });

    it('When getCdnJavascripts Then return all cdns of javascript libs', function () {
        var result = globalConfiguration.client.getCdnJavascripts();

        result.should.have.length(2);
        result.should.containEql('http://cdnjs.cloudflare.com/ajax/libs/knockout/3.1.0/knockout-min.js');
        result.should.containEql('http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery.min.js');
    });
});
