var gulp = require('gulp');
var plugin = require('gulp-load-plugins')();
var wiredep = require('wiredep');
var gulpBowerFiles = require('gulp-bower-files');
var mochaPhantomJs = require('gulp-mocha-phantomjs');
var paths = {
	src: {
        cssDir: "src/css",
        css: "src/css/*.css",
        jsDir:"src/js",
        js:"src/js/*.js",
        templates: "src/templates/*.hbs",
        lessDir: "src/less",
        less: "src/less/*.less"
	},
	test: {
		js:"test/*.js",
		runnerTemplate: "test/runner-template.html",
		runner: "test/runner.html"
	},
	testDir: "test",
    buildDir: "build"
};
var filePathRegex = /(\w+(?=\/)|\/)/g;
gulp.task('clean', function(){
    gulp.src(paths.build, {read: false})
        .pipe(plugin.clean());
});
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
gulp.task('less', function(){
    return gulp.src(paths.src.lessDir + '/main.less')
        .pipe(plugin.less({paths: [paths.src.lessDir + '/main.less']}))
        .pipe(gulp.dest(paths.src.cssDir))
        .on('error', plugin.util.log);
});
gulp.task('test', function() {
    gulp.src(paths.test.runnerTemplate)
        .pipe(wiredep.stream({
            devDependencies: true
        }))
        .pipe(plugin.inject(gulp.src(paths.src.js, {read: false}), {starttag:'<!-- inject:source:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.inject(gulp.src(paths.test.js, {read: false}), {starttag:'<!-- inject:tests:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.inject(gulp.src(paths.src.cssDir + '/main.css', {read: false}), {starttag:'<!-- inject:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.rename(paths.test.runner.replace(filePathRegex, '')))
        .pipe(gulp.dest(paths.testDir));

    return gulp.src(paths.test.runner)
    	.pipe(mochaPhantomJs());
});
gulp.task('watch', function () {
    gulp.watch(paths.src.less, ['less']);
    gulp.watch([paths.src.css, paths.src.js], ['test']);
    gulp.watch(paths.src.templates, ['templates']);
});