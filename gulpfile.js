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
    themes: {
        less: "themes/**/main.less",
        base: {
            less: "themes/base/less/*.less",
            lessMain: "themes/base/less/base.less",
            css: "themes/base/css/*.css",
            cssMain: "themes/base/css/base.css",
            cssDir: "themes/base/css"
        },
        portal: {
            less: "themes/portal/less/*.less",
            lessMain: "themes/portal/less/portal.less",
            css: "themes/portal/css/*.css",
            cssMain: "themes/portal/css/portal.css",
            cssDir: "themes/portal/css"
        }
    },
    build:{
        dir: "build",
        js: "build/upcycle.js",
        themes:"build/themes"
    },
    example: {
        dir: "example",
        index: "example/index.html"
    },
	testDir: "test",
    buildDir: "build"
};
var filePathRegex = /(\w+(?=\/)|\/)/g;
gulp.task('clean', function(){
    gulp.src(paths.build.dir, {read: false})
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
    return gulp.src(paths.themes.less)
        .pipe(plugin.less({paths: [paths.themes.less]}))
        .pipe(plugin.rename(function(path){
            path.basename = path.dirname.substring(0, path.dirname.indexOf('/'));
            path.dirname = '';  
        }))
        .pipe(gulp.dest(paths.build.themes))
        .on('error', plugin.util.log);
});
gulp.task('js', function(){
    return gulp.src(paths.src.js)
        .pipe(plugin.concat(paths.build.dir + '/upcycle.js'))
        .pipe(plugin.rename(function(path){
            path.dirname = '';
        }))
        .pipe(gulp.dest(paths.build.dir));
});
gulp.task('test', function() {
    gulp.src(paths.test.runnerTemplate)
        .pipe(wiredep.stream({
            devDependencies: true
        }))
        .pipe(plugin.inject(gulp.src(paths.src.js, {read: false}), {starttag:'<!-- inject:source:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.inject(gulp.src(paths.test.js, {read: false}), {starttag:'<!-- inject:tests:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.inject(gulp.src(paths.themes.base.cssMain, {read: false}), {starttag:'<!-- inject:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.rename(paths.test.runner.replace(filePathRegex, '')))
        .pipe(gulp.dest(paths.testDir));

    return gulp.src(paths.test.runner)
    	.pipe(mochaPhantomJs());
});
gulp.task('example', function(){
    gulp.src('example/index-template.html')
        .pipe(wiredep.stream({
            devDependencies: true
        }))
        .pipe(plugin.inject(gulp.src(paths.build.js, {read: false}), {starttag:'<!-- inject:source:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.inject(gulp.src(paths.build.themes+'/*.css', {read: false}), {starttag:'<!-- inject:{{ext}} -->', addRootSlash:false, addPrefix:'..'}))
        .pipe(plugin.rename(paths.example.index.replace(filePathRegex, '')))
        .pipe(gulp.dest(paths.example.dir));
});
gulp.task('build', ['clean', 'templates', 'less', 'js', 'test']);
gulp.task('watch', function () {
    gulp.watch(paths.themes.base.less, ['less']);
    gulp.watch([paths.themes.base.css, paths.src.js], ['test']);
    gulp.watch(paths.src.templates, ['templates']);
});