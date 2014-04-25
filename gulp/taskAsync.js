'use strict';

var Promise = require('Promise');
var gulp = require('gulp');

var startTask = function(taskName){
    return new Promise(function (resolve, reject) {
        gulp.once("task_stop", function(){
            resolve();
        });
        gulp.start(taskName);
    });
};

exports.start = startTask;

exports.create = function(taskName, task){
    return gulp.task(taskName, function() {
        var promise = task();

        return {
            done: function (resolve, reject) {
                promise.then(function () {
                    resolve();
                }).catch(function(error){
                    reject(error);
                });
            }
        };
    });
};
