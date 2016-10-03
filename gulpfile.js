'use strict';

const watchify = require('watchify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const assign = require('lodash.assign');

var path = {
  APP: 'src/app.js',
  DEST: 'bin',
  SASS: './src/stylesheets/**/*.scss',
  SASS_MAIN: './src/stylesheets/main.scss'
};

// browserify options
var customOpts = {
  entries: [path.APP],
  debug: true,
  verbose: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// browserify transformations
b.transform('babelify', {presets: ['latest', 'react']});

gulp.task('browserify:watch', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  return b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(path.DEST));
}

gulp.task('browserify', function() {
    return browserify(opts)
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .transform('babelify', {presets: ['latest', 'react']})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest(path.DEST));
});

gulp.task('sass', function () {
  return gulp.src('./src/stylesheets/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('sass:watch', function () {
  gulp.watch(path.SASS, ['sass']);
});

gulp.task('build', ['sass', 'browserify']);
gulp.task('watch', ['sass:watch', 'browserify:watch']);
gulp.task('default', ['build']);
