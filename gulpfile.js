var gulp = require('gulp');
var plugin = require('gulp-load-plugins')();
var wiredep = require('wiredep').stream;
var gulpBowerFiles = require('gulp-bower-files');
var mochaPhantomJs = require('gulp-mocha-phantomjs');
var paths = {
	srcJs: "src/js/*.js",
	testJs: "test/*.js"
};
gulp.task('test', function() {
    gulp.src('test/runner-template.html')
        .pipe(wiredep({
            devDependencies: true
        }))
        .pipe(plugin.inject(gulp.src(paths.srcJs, {read: false}), {starttag:'<!-- inject:source:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.inject(gulp.src(paths.testJs, {read: false}), {starttag:'<!-- inject:tests:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.rename('runner.html'))
        .pipe(gulp.dest('test'));

    return gulp.src('test/runner.html')
    	.pipe(mochaPhantomJs());
});
gulp.task('watch', function () {
    gulp.watch(paths.srcJs, ['test']);
});