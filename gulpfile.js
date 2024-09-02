const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const path = require('path');
const ignore = require('gulp-ignore');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const sourcemaps = require('gulp-sourcemaps');

const paths = {
  src: 'src/',
  css: 'src/css/**/*.css', // Ścieżka do plików CSS
  partials: 'src/partials',
  dest: 'public_html/'
};

gulp.task('html', function() {
  return gulp.src([path.join(paths.src, '**/*.html')]) // Przetwarza wszystkie pliki HTML w src i podfolderach
    .pipe(ignore.exclude('partials/**/*')) // Wyklucza folder partials z kopiowania
    .pipe(fileInclude({
      prefix: '@@',
      basepath: path.join(__dirname, paths.partials) // Ustawione na katalog partials, przeszukuje również podfoldery,
    }))
    .pipe(gulp.dest(paths.dest)); // Zapisuje przetworzone pliki HTML w folderze docelowym
});

// Zadanie do przetwarzania plików CSS
gulp.task('css', function() {
  return gulp.src(paths.css)
    .pipe(sourcemaps.init())
    .pipe(postcss([
      autoprefixer(),
      postcssPresetEnv({ stage: 3 })
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(paths.dest, 'css')));
});

gulp.task('watch', function() {
  gulp.watch([
    path.join(paths.src, '*.html', '**/*.html'), // Monitoruje zmiany w folderze src
    path.join(paths.partials, '**/*.html'), // Monitoruje zmiany w folderze partials
    ], gulp.series('html'));
  gulp.watch(paths.css, gulp.series('css')); // Monitoruje zmiany w plikach CSS
});

gulp.task('default', gulp.series('html', 'css'));
