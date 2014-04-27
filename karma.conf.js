var globalConfigurationClient = require('./libs/globalConfiguration').client;

var urlPrefix = '/base/public/javascripts/';
var pathPrefix = '/base/';

var pushJavascriptLibsInConfig = function(config, lib){
    config.proxies[urlPrefix + lib.name + '.js'] = pathPrefix + lib.path;
    config.files.push({pattern: lib.path, included: false});
}

var includeExternalLibs = function(config){
    config.proxies = {};
    var externalJavascripts = globalConfigurationClient.getExternalJavascriptsWithLocalPath();
    for(var key in externalJavascripts){
        pushJavascriptLibsInConfig(config, externalJavascripts[key]);
    }

    pushJavascriptLibsInConfig(config, { name: 'sinon', path: 'bower_components/sinon/lib/sinon.js' });
};

var karmaConfiguration = {
    frameworks: ['mocha', 'requirejs', 'chai'],
    files: [
        'test-main.js',
        {pattern: 'public/javascripts/**/*.js', included: false},
        {pattern: 'test/public/**/*.js', included: false}
    ],
    exclude: [
        'public/javascripts/app.js'
    ],
    autoWatch: true,
    browsers: ['PhantomJS'],
    reporters: ['progress', 'junit'],
    junitReporter: {
        outputFile: 'testsKarma-report.xml'
    }
};

includeExternalLibs(karmaConfiguration);

module.exports = function(config) {
  config.set(karmaConfiguration);
};
