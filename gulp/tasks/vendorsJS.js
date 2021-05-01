const gulp = require('gulp');
const concat = require('gulp-concat');

const vendorsScripts = [
  // 'node_modules/jquery/dist/jquery.min.js',
  'node_modules/svg4everybody/dist/svg4everybody.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
  'node_modules/choices.js/public/assets/scripts/choices.min.js',
  // 'node_modules/dropzone/dist/min/dropzone.min.js',
  'node_modules/dropzone/dist/dropzone.js',
  'node_modules/js-datepicker/dist/datepicker.min.js',
  'node_modules/swiper/swiper-bundle.min.js',
  // 'node_modules/lightgallery/dist/js/lightgallery-all.min.js',
  // 'node_modules/lightgallery/modules/lg-thumbnail.min.js',
  // 'node_modules/lightgallery/modules/lg-fullscreen.min.js',
  'node_modules/lightgallery.js/dist/js/lightgallery.min.js',
  'node_modules/lightgallery.js/src/js/lg-thumbnail.min.js',
  'node_modules/lightgallery.js/src/js/lg-zoom.min.js',

];

module.exports = function vendors(cb) {
  return vendorsScripts.length
    ? gulp
        .src(vendorsScripts)
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('dist/static/js/'))
    : cb();
};
