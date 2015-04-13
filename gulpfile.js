var amdOptimize = require("amd-optimize");
var clean = require('gulp-clean');
var concat = require("gulp-concat");
var cover = require('gulp-coverage');
var csslint = require('gulp-csslint');
var gulp = require('gulp');
var htmlhint = require("gulp-htmlhint");
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var configuration = require('./gulp/configuration');
var homeBuilder = require('./gulp/homeBuilder');
var taskAsync = require('./gulp/taskAsync');
var testRunner = require('./gulp/testRunner');

var clientConfiguration = configuration.client;
var serverConfiguration = configuration.server;

gulp.task('dev-html-create-layout', function () {
    return gulp.src(clientConfiguration.getLayoutPath())
        .pipe(rename(clientConfiguration.getHomeFileName()))
        .pipe(gulp.dest(clientConfiguration.getDirectory()));
});

gulp.task('dev-html-watch', ['dev-html-create-layout'], function () {
    gulp.watch(clientConfiguration.getLayoutPath(), ['dev-html-create-layout']);
});

gulp.task('dev-css-less-watch', function () {
    watch({glob: clientConfiguration.getLessFilesPattern()})
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(clientConfiguration.getCssDirectory()));
});

gulp.task('dev-js-server-test-watch', ['test-server'], function () {
    gulp.watch(serverConfiguration.getAllJavascriptFilesPattern(), ['test-server']);
});

gulp.task('dev-js-client-test-watch', function () {
    testRunner.runClient(true);
});

gulp.task('check-js-watch', function() {
    watch({glob: configuration.getAllJavascriptFilesWithoutTestsPattern()})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('check-html-watch', function() {
    watch({glob: clientConfiguration.getHtmlFilesPattern()})
        .pipe(plumber())
        .pipe(htmlhint({
            "doctype-first": false
        }))
        .pipe(htmlhint.reporter());
});

gulp.task('check-css-watch', function() {
    watch({glob: clientConfiguration.getCssFilesPattern()})
        .pipe(plumber())
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('check-watch', ['check-js-watch', 'check-html-watch', 'check-css-watch']);
gulp.task('test-watch', ['dev-js-server-test-watch', 'dev-js-client-test-watch']);

gulp.task('dev', ['dev-css-less-watch', 'test-watch', 'check-watch', 'dev-html-watch']);

gulp.task('test-server-cover', function () {
    return gulp.src(serverConfiguration.getTestFilesPattern(), { read: false })
        .pipe(cover.instrument({
            pattern: serverConfiguration.getJavascriptFilesPattern(),
            debugDirectory: serverConfiguration.getCoverTempDirectory()
        }))
        .pipe(mocha())
        .pipe(cover.report({
            outFile: serverConfiguration.getCoverOutput()
        }));
});

gulp.task('test-server', function () {
    return testRunner.runServer(serverConfiguration.getTestDirectory());
});

gulp.task('test-server-with-report', function () {
    return testRunner.runServer(serverConfiguration.getTestDirectory(), true);
});

gulp.task('test-client', function() {
    return testRunner.runClient();
});

gulp.task('test', ['test-client', 'test-server']);

gulp.task('check-js', function() {
    return gulp.src(configuration.getAllJavascriptFilesWithoutTestsPattern())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('check-html', function() {
    return gulp.src(clientConfiguration.getHtmlFilesPattern())
        .pipe(htmlhint({
            "doctype-first": false
        }))
        .pipe(htmlhint.reporter());
});

gulp.task('check-css', function() {
    return gulp.src(clientConfiguration.getCssFilesPattern())
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('check', ['check-css', 'check-html', 'check-js']);

gulp.task('build-css', function() {
    return gulp.src(clientConfiguration.getLessFilesPattern())
        .pipe(less())
        .pipe(concat(clientConfiguration.getBuildCssFileName()))
        .pipe(minifyCSS())
        .pipe(gulp.dest(clientConfiguration.getBuildDirectory()));
});

gulp.task('build-js', function() {
    var requireJsConfiguration = {
        optimize: "none"
    };

    var externalLibNames = clientConfiguration.getExternalLibNames();
    requireJsConfiguration.paths = {};
    for(var key in externalLibNames){
        requireJsConfiguration.paths[externalLibNames[key]] = 'empty:';
    }

    return gulp.src(clientConfiguration.getJavascriptFilesPattern())
        .pipe(amdOptimize(clientConfiguration.getRequireMainModule(), requireJsConfiguration))
        .pipe(concat(clientConfiguration.getBuildJavascriptFileName()))
        .pipe(uglify())
        .pipe(gulp.dest(clientConfiguration.getBuildDirectory()));
});

gulp.task('build-html', function() {
    return gulp.src(clientConfiguration.getLayoutPath())
        .pipe(homeBuilder.injectBuildedCss())
        .pipe(homeBuilder.injectBuildedJs())
        .pipe(homeBuilder.addVersionOnFilesIncluded())
        .pipe(minifyHTML())
        .pipe(rename(clientConfiguration.getHomeFileName()))
        .pipe(gulp.dest(clientConfiguration.getBuildDirectory()));
});

gulp.task('build-staticFiles', function() {
    return gulp.src(clientConfiguration.getStaticFilesPattern())
        .pipe(gulp.dest(clientConfiguration.getBuildDirectory()));
});

gulp.task('build-clean', function() {
    return gulp.src(clientConfiguration.getBuildDirectory(), {read: false})
        .pipe(clean());
});

taskAsync.create('build', function(){
    return taskAsync.start('build-clean')
        .then(function(){
            return taskAsync.start('build-css')
        }).then(function(){
            return taskAsync.start('build-js')
        }).then(function(){
            return taskAsync.start('build-html')
        }).then(function(){
            return taskAsync.start('build-staticFiles')
        });
});

gulp.task('default', ['dev']);

gulp.task('jenkins', function(){
    gulp.start('test-client');
    gulp.start('test-server-with-report');
});