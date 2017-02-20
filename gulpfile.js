var gulp = require('gulp')
, sourcemaps = require('gulp-sourcemaps')
, sass = require('gulp-sass')
, concat = require('gulp-concat')
, CacheBuster = require('gulp-cachebust')
, print = require('gulp-print')
, babel = require('gulp-babel')
, uglify = require('gulp-uglify');

var cachebust = new CacheBuster();

gulp.task('build-css', function() {
  return gulp.src('./public/styles/**/*.*css')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(cachebust.resources())
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('./public/maps'))
    .pipe(gulp.dest('./public/dist'));
});

gulp.task('build-js', function() {
   return gulp.src('./public/js/**/*.js')               
      .pipe(sourcemaps.init())
      .pipe(print())                        
      .pipe(babel({ presets: ['es2015'] }))
      .pipe(concat('bundle.js'))
      .pipe(sourcemaps.write('./public/')) 
      .pipe(gulp.dest('./public/dist/js')); 
});

gulp.task('build', ['build-css', 'build-js'], function() {
    return gulp.src('./public/index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('./public/dist'));
});

gulp.task('watch', function() {
    return gulp.watch(['./public/index.html', './public/views/*.html', './public/styles/**/*.*css', './public/js/**/*.js'], ['build']);
});

gulp.task('default', ['build', 'watch']);