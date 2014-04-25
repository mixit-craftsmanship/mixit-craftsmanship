var configuration = require('./configuration');

var includeExternalLibs = function(config){
    var urlPrefix = '/base/public/javascripts/';
    var pathPrefix = '/base/';

    config.proxies = {};
    var externalLibs = configuration.externalLibs;
    for(var name in externalLibs){
        config.proxies[urlPrefix + name + '.js'] = pathPrefix + externalLibs[name];
        config.files.push({pattern: externalLibs[name], included: false});
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
