var amdOptimize = require("amd-optimize");
var clean = require('gulp-clean');
var cheerio = require('gulp-cheerio');
var concat = require("gulp-concat");
var cover = require('gulp-coverage');
var crypto = require('crypto');
var csslint = require('gulp-csslint');
var es = require('event-stream');
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
var Promise = require('promise');
var spawn = require('child_process').spawn;
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

var PublicDirectory = 'public/';
var PublicBuildDirectory = 'public/build/';
var PublicBuildedJavascriptFileName = 'app.min.js';
var PublicBuildedCssFileName = 'app.min.css';
var PublicBuildedTemplateFileName = 'templates.html';
var PublicStylesDirectory = 'public/stylesheets/';
var PublicJavascriptsDirectory = 'public/javascripts/';
var PublicJavascriptTestDirectory = 'test/public/';
var PublicTemplatesDirectory = 'public/templates/';
var ServerJavascriptsDirectory = 'libs/';
var ServerJavascriptTestsDirectory = 'test/libs/';



//var gulpBowerFiles = require('gulp-bower-files');
//gulp.task("bower-files", function(){
//    gulpBowerFiles().pipe(gulp.dest("./public/libs"));
//});

var getFileNameWithoutExtension = function(file) {
    return path.basename(file.path, path.extname(file.path));
};

var partials = function(config, data) {

    config        = config || {};
    config.suffix = config.suffix || '-viewtpl';
    config.ext    = config.ext || '.html';

    return es.map(function(file, cb) {

        var fileName  = getFileNameWithoutExtension(file);
        var scriptOpen = '<script type="text/template" id="'+fileName+config.suffix+'">';

        file.contents = Buffer.concat([
            new Buffer(scriptOpen, data),
            file.contents,
            new Buffer('</script>', data)
        ]);
        cb(null, file);
    });
};

var injectTemplate = function(homeFileName) {
    return es.map(function(file, cb) {
        var templateName  = getFileNameWithoutExtension(file) + "Template";
        var templateContent = file.contents.toString();

        var homeContent = fs.readFileSync(PublicDirectory + homeFileName, 'utf-8');

        var $ = require('cheerio').load(homeContent);
        $('script[id='+templateName+']').remove();
        $('body').append(templateContent);

        fs.writeFileSync(PublicDirectory + homeFileName, $.html(), 'utf-8');

        cb(null, file);
    });
};

gulp.task('dev-html-templates-watch', function () {
    watch({glob: PublicTemplatesDirectory + '**/*.html'})
        .pipe(plumber())
        .pipe(partials({
            suffix : "Template"
        }))
        .pipe(injectTemplate("index.html"))
        .pipe(gulp.dest(PublicDirectory));
});

gulp.task('dev-css-less-watch', function () {
    watch({glob: PublicStylesDirectory + '**/*.less'})
        .pipe(plumber())
        .pipe(less())
        .pipe(gulp.dest(PublicStylesDirectory));
});

gulp.task('dev-js-server-test-watch', function () {
    gulp.watch([ServerJavascriptsDirectory + '**/*.js', ServerJavascriptTestsDirectory + '**/*.js'], ['test-server']);
});

gulp.task('dev-js-client-test-watch', function () {
    spawn('node', ['node_modules/karma/bin/karma', 'start'], { stdio: 'inherit' });
});

gulp.task('check-js-watch', function() {
    watch({glob: [ServerJavascriptsDirectory + '**/*.js', ServerJavascriptTestsDirectory + '**/*.js', PublicJavascriptsDirectory + '**/*.js', PublicJavascriptTestDirectory + '**/*.js', 'app.js']})
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('check-html-watch', function() {
    watch({glob: [PublicDirectory + "index.html", PublicTemplatesDirectory + "**/*.html"]})
        .pipe(plumber())
        .pipe(htmlhint({
            "doctype-first": false
        }))
        .pipe(htmlhint.reporter());
});

gulp.task('check-css-watch', function() {
    watch({glob: PublicStylesDirectory + '**/*.css'})
        .pipe(plumber())
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('check-watch', ['check-js-watch', 'check-html-watch', 'check-css-watch']);
gulp.task('test-watch', ['dev-js-server-test-watch', 'dev-js-client-test-watch']);

gulp.task('dev', ['dev-css-less-watch', 'test-watch', 'check-watch']);

gulp.task('test-server-cover', function () {
    return gulp.src(ServerJavascriptTestsDirectory + '**/*.js', { read: false })
        .pipe(cover.instrument({
            pattern: [ ServerJavascriptsDirectory + '**/*.js'],
            debugDirectory: 'debug'
        }))
        .pipe(mocha())
        .pipe(cover.report({
            outFile: 'coverage.html'
        }));
});

var runMocha = function () {
    return spawn('node', ['node_modules/mocha/bin/_mocha', 'test/libs', '--recursive'], { stdio: 'inherit' });
};

gulp.task('test-server', function () {
    return runMocha();
});

gulp.task('test-client', function() {
    return spawn('node', ['node_modules/karma/bin/karma', 'start', '--singleRun'], { stdio: 'inherit' });
});

gulp.task('test', ['test-client', 'test-server']);

gulp.task('check-js', function() {
    return gulp.src([ServerJavascriptsDirectory + '**/*.js', ServerJavascriptTestsDirectory + '**/*.js', PublicJavascriptsDirectory + '**/*.js', PublicJavascriptTestDirectory + '**/*.js', 'app.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('check-html', function() {
    return gulp.src([PublicDirectory + "index.html", PublicTemplatesDirectory + "**/*.html"])
        .pipe(htmlhint({
            "doctype-first": false
        }))
        .pipe(htmlhint.reporter());
});

gulp.task('check-css', function() {
    return gulp.src(PublicStylesDirectory + '**/*.css')
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('check', ['check-css', 'check-html', 'check-js']);

gulp.task('build-css', function() {
    return gulp.src(PublicStylesDirectory + '**/*.less')
        .pipe(less())
        .pipe(concat(PublicBuildedCssFileName))
        .pipe(minifyCSS())
        .pipe(gulp.dest(PublicBuildDirectory));
});

gulp.task('build-js', function() {
    return gulp.src(PublicJavascriptsDirectory + "**/*.js")
        .pipe(amdOptimize("app", ({
            paths: {
                "knockout": 'empty:',
                "jquery": 'empty:'
            },
            optimize: "none"
        })))
        .pipe(concat(PublicBuildedJavascriptFileName))
        .pipe(uglify())
        .pipe(gulp.dest(PublicBuildDirectory));
});

gulp.task('build-html-templates', function () {
    return gulp.src(PublicTemplatesDirectory + '**/*.html')
        .pipe(partials({
            suffix : "Template"
        }))
        .pipe(concat(PublicBuildedTemplateFileName))
        .pipe(gulp.dest(PublicBuildDirectory));
});

var injectBuildedCss = function(){
    return cheerio(function ($) {
        $('link:not([attr^=http])').remove();
        $('head').append('<link rel="stylesheet" href="'+ PublicBuildedCssFileName +'">');
    });
};

var injectBuildedJs = function(){
    return cheerio(function ($) {
        $('script:not([attr^=http])').remove();
        $('body').append('<script src="'+ PublicBuildedJavascriptFileName +'"></script>');
    });
};

var injectBuildedTemplates = function(){
    return cheerio(function ($) {
        var templates = fs.readFileSync(PublicBuildDirectory + PublicBuildedTemplateFileName, 'utf-8');
        $('body').append(templates);
    });
};

var computeFileVersion = function(file){
    var content = fs.readFileSync(file);
    return crypto.createHash("md5").update(content).digest('hex');
};

var addVersionOnLink = function($element, attributName){
    var file = $element.attr(attributName);
    if(file == undefined || file.indexOf("http") == 0) {
        return;
    }

    var suffix = computeFileVersion(PublicBuildDirectory + file);
    $element.attr(attributName, file + "?v=" + suffix);
};

var addVersionOnFilesIncluded = function(){
    return cheerio(function ($) {
        $('link').each(function () {
            addVersionOnLink($(this), 'href');
        });
        $('script').each(function () {
            addVersionOnLink($(this), 'src');
        });
    });
};

gulp.task('build-html', ['build-html-templates'], function() {
    return gulp.src(PublicDirectory + 'index.html')
        .pipe(injectBuildedCss())
        .pipe(injectBuildedJs())
        .pipe(injectBuildedTemplates())
        .pipe(addVersionOnFilesIncluded())
        .pipe(minifyHTML())
        .pipe(gulp.dest(PublicBuildDirectory));
});

//var domSrc = require('gulp-dom-src');
//gulp.task('build-css-contact', function() {
//    return domSrc({file:'public/index.html',selector:'link',attribute:'href'})
//        .pipe(concat('app.full.min.css'))
//        .pipe(gulp.dest('public/dist/'));
//});

gulp.task('build-clean', function() {
    return gulp.src(PublicBuildDirectory, {read: false})
        .pipe(clean());
});

var startTask = function(taskName){
    return new Promise(function (resolve, reject) {
        gulp.once("task_stop", function(){
            resolve();
        });
        gulp.start(taskName);
    });
};

var createTaskAsync = function(taskName, task){
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

createTaskAsync('build', function(){
    return startTask('build-clean')
        .then(function(){
            return startTask('build-css')
        }).then(function(){
            return startTask('build-js')
        }).then(function(){
            return startTask('build-html')
        });
});

gulp.task('default', ['dev']);