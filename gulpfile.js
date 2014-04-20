var amdOptimize = require("amd-optimize");
var clean = require('gulp-clean');
var concat = require("gulp-concat");
var cover = require('gulp-coverage');
var csslint = require('gulp-csslint');
var fs = require('fs');
var gulp = require('gulp');
var htmlhint = require("gulp-htmlhint");
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var mocha = require('gulp-mocha');
var path = require('path');
var plumber = require('gulp-plumber');
var spawn = require('child_process').spawn;
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');


var templateWrapper = require('./gulp/templateWrapper');
var templateInjector = require('./gulp/templateInjector');
var homeBuilder = require('./gulp/homeBuilder');
var taskAsync = require('./gulp/taskAsync');
var configuration = require('./gulp/configuration');

var clientConfiguration = configuration.client;
var serverConfiguration = configuration.server;

homeBuilder.configure({
    cssFileName: clientConfiguration.getBuildCssFileName(),
    javascriptFileName: clientConfiguration.getBuildJavascriptFileName(),
    templatesFileName: clientConfiguration.getBuildTemplateFileName(),
    outputDirectory: clientConfiguration.getBuildDirectory()
});

//var gulpBowerFiles = require('gulp-bower-files');
//gulp.task("bower-files", function(){
//    gulpBowerFiles().pipe(gulp.dest("./public/libs"));
//});

gulp.task('dev-html-templates-watch', function () {
    watch({glob: clientConfiguration.getTemplateFilesPattern()})
        .pipe(plumber())
        .pipe(templateWrapper.wrap())
        .pipe(templateInjector.inject(clientConfiguration.getHomePath()))
        .pipe(gulp.dest(clientConfiguration.getDirectory()));
});

gulp.task('dev-css-less-watch', function () {
    watch({glob: clientConfiguration.getLessFilesPattern()})
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(clientConfiguration.getCssDirectory()));
});

gulp.task('dev-js-server-test-watch', function () {
    gulp.watch(serverConfiguration.getAllJavascriptFilesPattern(), ['test-server']);
});

gulp.task('dev-js-client-test-watch', function () {
    spawn('node', ['node_modules/karma/bin/karma', 'start'], { stdio: 'inherit' });
});

gulp.task('check-js-watch', function() {
    watch({glob: configuration.getAllJavascriptFilesPattern()})
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

gulp.task('dev', ['dev-css-less-watch', 'test-watch', 'check-watch']);

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

var runMocha = function () {
    return spawn('node', ['node_modules/mocha/bin/_mocha', serverConfiguration.getTestDirectory(), '--recursive'], { stdio: 'inherit' });
};

gulp.task('test-server', function () {
    return runMocha();
});

gulp.task('test-client', function() {
    return spawn('node', ['node_modules/karma/bin/karma', 'start', '--singleRun'], { stdio: 'inherit' });
});

gulp.task('test', ['test-client', 'test-server']);

gulp.task('check-js', function() {
    return gulp.src(configuration.getAllJavascriptFilesPattern())
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
    return gulp.src(clientConfiguration.getJavascriptFilesPattern())
        .pipe(amdOptimize("app", ({
            paths: {
                "knockout": 'empty:',
                "jquery": 'empty:'
            },
            optimize: "none"
        })))
        .pipe(concat(clientConfiguration.getBuildJavascriptFileName()))
        .pipe(uglify())
        .pipe(gulp.dest(clientConfiguration.getBuildDirectory()));
});

gulp.task('build-html-templates', function () {
    return gulp.src(clientConfiguration.getTemplateFilesPattern())
        .pipe(templateWrapper.wrap())
        .pipe(concat(clientConfiguration.getBuildTemplateFileName()))
        .pipe(gulp.dest(clientConfiguration.getBuildDirectory()));
});

gulp.task('build-html', ['build-html-templates'], function() {
    return gulp.src(clientConfiguration.getHomePath())
        .pipe(homeBuilder.injectBuildedCss())
        .pipe(homeBuilder.injectBuildedJs())
        .pipe(homeBuilder.injectBuildedTemplates())
        .pipe(homeBuilder.addVersionOnFilesIncluded())
        .pipe(minifyHTML())
        .pipe(gulp.dest(clientConfiguration.getBuildDirectory()));
});

//var domSrc = require('gulp-dom-src');
//gulp.task('build-css-contact', function() {
//    return domSrc({file:'public/index.html',selector:'link',attribute:'href'})
//        .pipe(concat('app.full.min.css'))
//        .pipe(gulp.dest('public/dist/'));
//});

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
        });
});

gulp.task('default', ['dev']);