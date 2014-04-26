var globalConfigurationClient = require('./libs/globalConfiguration').client;

var includeExternalLibs = function(config){
    var urlPrefix = '/base/public/javascripts/';
    var pathPrefix = '/base/';

    config.proxies = {};
    var externalJavascripts = globalConfigurationClient.getExternalJavascriptsWithLocalPath();
    for(var key in externalJavascripts){
        var item = externalJavascripts[key];
        config.proxies[urlPrefix + item.name + '.js'] = pathPrefix + item.path;
        config.files.push({pattern: item.path, included: false});
    }
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
