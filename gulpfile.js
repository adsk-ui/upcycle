var gulp = require('gulp');
var plugin = require('gulp-load-plugins')();
var wiredep = require('wiredep');
gulp.task('styles', function(){
	return gulp.src('less/bootstrap-scope.less')
		.pipe(plugin.less())
		.pipe(gulp.dest('stylesheets'));
});
gulp.task('build', function(){
	return gulp.src('index.template.html')
		.pipe(wiredep.stream())
		.pipe(plugin.rename('index.html'))
		.pipe(gulp.dest('./'));
});