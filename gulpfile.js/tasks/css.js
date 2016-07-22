var config       = require('../config')
if(!config.tasks.css) return

var gulp         = require('gulp')
var gulpif       = require('gulp-if')
// var browserSync  = require('browser-sync')
var sourcemaps   = require('gulp-sourcemaps')
var lessChanged = require('gulp-less-changed');
var less         = require('gulp-less');
var handleErrors = require('../lib/handleErrors')
var autoprefixer = require('gulp-autoprefixer')
var path         = require('path')
var cssnano      = require('gulp-cssnano')

var paths = {
  src: [
      path.join(config.root.src, config.tasks.css.src, '/**/*.{' + config.tasks.css.extensions + '}'),
      path.join('!' + config.root.src, config.tasks.css.src, '/**/_*.{' + config.tasks.css.extensions + '}')
    ],
  dest: path.join(config.root.dest, config.tasks.css.dest)
};

var cssTask = function () {
  return gulp.src(paths.src)
    .pipe(gulpif(!global.production, sourcemaps.init()))
    .pipe(lessChanged())
    .pipe(less())
    .on('error', handleErrors)
    // .pipe(autoprefixer(config.tasks.css.autoprefixer))
    .pipe(gulpif(global.production, cssnano({autoprefixer: false})))
    .pipe(gulpif(!global.production, sourcemaps.write()))
    .pipe(gulp.dest(paths.dest))
    // .pipe(browserSync.stream())
}

gulp.task('css', cssTask)
module.exports = cssTask