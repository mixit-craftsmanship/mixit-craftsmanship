'use strict';

var spawn = require('child_process').spawn;

var runNodeScript = function(args){
    return spawn('node', args, { stdio: 'inherit' });
};

exports.runClient = function(watch){
    var args = ['node_modules/karma/bin/karma', 'start'];

    if(!watch){
        args.push('--singleRun');
    }

    return runNodeScript(args);
};

exports.runServer = function(testDirectory, withReport){
    var args = ['node_modules/mocha/bin/_mocha', testDirectory, '--recursive'];

    if(withReport){
        args.push('-R');
        args.push('mocha-jenkins-reporter');
    }

    return runNodeScript(args);
};
