var gulp = require('gulp');
var plugin = require('gulp-load-plugins')();
var wiredep = require('wiredep');
var gulpBowerFiles = require('gulp-bower-files');
var mochaPhantomJs = require('gulp-mocha-phantomjs');
var paths = {
	src: {
		jsDir:"src/js",
		js:"src/js/*.js",
		templates: "src/templates/*.hbs"
	},
	test: {
		js:"test/*.js",
		runnerTemplate: "test/runner-template.html",
		runner: "test/runner.html"
	},
	testDir: "test"
};
var filePathRegex = /(\w+(?=\/)|\/)/g;

gulp.task('templates', function(){
  gulp.src([paths.src.templates])
    .pipe(plugin.handlebars())
    .pipe(plugin.defineModule('plain'))
    .pipe(plugin.declare({
      namespace: "Upcycle.templates"
    }))
    .pipe(plugin.concat('templates.js'))
    .pipe(gulp.dest(paths.src.jsDir));
});
gulp.task('test', function() {
    gulp.src(paths.test.runnerTemplate)
        .pipe(wiredep.stream({
            devDependencies: true
        }))
        .pipe(plugin.inject(gulp.src(paths.src.js, {read: false}), {starttag:'<!-- inject:source:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.inject(gulp.src(paths.test.js, {read: false}), {starttag:'<!-- inject:tests:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.rename(paths.test.runner.replace(filePathRegex, '')))
        .pipe(gulp.dest(paths.testDir));

    return gulp.src(paths.test.runner)
    	.pipe(mochaPhantomJs());
});
gulp.task('watch', function () {
    gulp.watch(paths.src.js, ['test']);
    gulp.watch(paths.src.templates, ['templates']);
});