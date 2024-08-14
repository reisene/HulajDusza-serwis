const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const path = require('path');
const ignore = require('gulp-ignore');

const paths = {
  src: 'src/',
  dest: 'public_html/'
};

gulp.task('html', function() {
  return gulp.src([path.join(paths.src, '*.html')])
    .pipe(ignore.exclude('head.html'))
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch([path.join(paths.src, '*.html'), path.join(paths.src, '**/*.html'), '!src/head.html'], gulp.series('html'));
});

gulp.task('default', gulp.series('html'));
