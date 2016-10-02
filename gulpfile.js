'use strict';

const browserify = require('browserify');
const source = require('vinyl-source-stream');
const gulp = require('gulp');
const sass = require('gulp-sass');

var path = {
  SASS: 'src/stylesheets/**/*.scss',
  SASS_MAIN: 'src/stylesheets/main.scss',
  DEST: 'bin'
};

gulp.task('sass', function () {
  return gulp.src(path.SASS_MAIN)
    .pipe(sass().on('error', sass.logError))
    .pipe(source('style.css'))
    .pipe(gulp.dest(path.DEST));
});

gulp.task('sass:watch', function () {
  gulp.watch(path.SASS, ['sass']);
});

gulp.task('browserify', function() {
    return browserify('./src/app.js')
      .transform('babelify', {presets: ['latest', 'react']})
      .bundle()
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('bundle.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest(path.DEST));
});
