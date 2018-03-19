'use strict';

var gulp = require('gulp'),
		gutil = require('gulp-util'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		prettify = require('gulp-html-prettify'),
		cssbeautify = require('gulp-cssbeautify'),
		jsbeautify = require('gulp-js-prettify'),
		browserSync = require('browser-sync').create();

var paths = {
  scripts: ['app/**/*.js', 'app/js/**/*.js'],
  styles: './app/**/*.scss',
  index: './app/index.html',
  partials: ['app/views/*.html', '!app/index.html'],
  distProd: 'public',
  distProdTemplates: 'public/views'
};
// compile scss files to css files
gulp.task('styles', function() {
	gulp.src(paths.styles)
		.pipe(sass().on('error', sass.logError))
		.pipe(cssbeautify({
			indent: ' ',
			autosemicolon: true
		}))
		.pipe(gulp.dest(paths.distProd));
	browserSync.reload();
});
// copy javascript to production folder
gulp.task('scripts', function() {
	gulp.src(paths.scripts)
		.pipe(jsbeautify({
			'indent_char': ' ',
			'indent_size': 2
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.distProd));
	browserSync.reload();
});
// index html
gulp.task('index', function() {
	gulp.src(paths.index)
		//.pipe(validator())
		.pipe(prettify({
			'indent_char': ' ',
			'indent_size': 2
		}))
		.pipe(gulp.dest('./'));
	browserSync.reload();
});
// template html files
gulp.task('templates', function() {
	gulp.src(paths.partials)
		.pipe(prettify({
			indent_char: ' ',
			indent_size: 2
		}))
		.pipe(gulp.dest(paths.distProdTemplates));
	browserSync.reload();
});
// console log
gulp.task('console-log', function() {
	gutil.log('Gulp is running!');
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});
});
// watcher
gulp.task('watch',function() {
	gulp.watch(paths.index, ['index']);
	gulp.watch(paths.partials, ['templates']);
	gulp.watch(paths.styles,['styles']);
	gulp.watch(paths.scripts, ['scripts']);
});
// create a default task and just log a message
gulp.task('default', ['console-log', 'index', 'styles', 'scripts', 'templates', 'watch']);