'use strict';

var spawn = require('child_process').spawn;

exports.runClient = function(watch){
    var args = ['node_modules/karma/bin/karma', 'start'];

    if(!watch){
        args.push('--singleRun');
    }

    return spawn('node', args, { stdio: 'inherit' })
};

exports.runServer = function(testDirectory){
    return spawn('node', ['node_modules/mocha/bin/_mocha', testDirectory, '--recursive', '-R', 'mocha-jenkins-reporter'], { stdio: 'inherit' });
};
