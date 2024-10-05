require ('./instruments.js');

const gulp = require('gulp');
const fileInclude = require('gulp-file-include');
const replace = require('gulp-replace');
const path = require('path');
const ignore = require('gulp-ignore');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs').promises;
const babel = require('gulp-babel');

const paths = {
  src: 'src/',
  css: 'src/css/**/*.css', // Ścieżka do plików CSS
  partials: 'src/partials',
  js: 'src/js/**/*.js',
  dest: 'public_html/',
  posts: 'src/posts',
};

gulp.task('html', function() {
  // Processes HTML files.
  return gulp.src([path.join(paths.src, '**/*.html')]) // Przetwarza wszystkie pliki HTML w src i podfolderach
    .pipe(ignore.exclude('partials/**/*')) // Wyklucza folder partials z kopiowania
    .pipe(ignore.exclude('posts/template.html')) // Wyklucza plik template.html z kopiowania
    .pipe(fileInclude({
      prefix: '@@',
      basepath: path.join(__dirname, paths.partials), // Ustawione na katalog partials, przeszukuje również podfoldery,
    }))
    .pipe(gulp.dest(paths.dest)); // Zapisuje przetworzone pliki HTML w folderze docelowym
});

// Zadanie do przetwarzania plików CSS
gulp.task('css', function() {
  try {
    // Compiles CSS files.
    return gulp.src(paths.css)
      .pipe(sourcemaps.init())
      .pipe(postcss([
        autoprefixer(),
        postcssPresetEnv({ stage: 3 }),
      ]))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(path.join(paths.dest, 'css')));
    } catch (error) {
      Sentry.captureException(error); 
    }
});

gulp.task('watchPosts', async function() {
  const postPaths = [];
  const files = await fs.readdir(paths.posts);
  files.forEach(file => {
    if (file.endsWith('.html') && file !== 'template.html') {
      postPaths.push(`/posts/${file}`);
    }
  });
  const content = `export default [\n${postPaths.map(path => `  '${path}'`).join(',\n')}\n];`;
  await fs.writeFile('src/js/modules/post-paths.js', content, 'utf8');
  await fs.copyFile('src/js/modules/post-paths.js', 'public_html/js/modules/post-paths.js');
});

gulp.task('js', () => {
  return gulp.src('src/js/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('public_html/js'));
});

gulp.task('watch', function() {
  // Sets up file watching for Gulp tasks.
  gulp.watch([
    path.join(paths.src, '*.html', '**/*.html'), // Monitoruje zmiany w folderze src
    path.join(paths.partials, '**/*.html'), // Monitoruje zmiany w folderze partials
    ], gulp.series('html'));
  gulp.watch(paths.css, gulp.series('css')); // Monitoruje zmiany w plikach CSS
  gulp.watch(paths.js, gulp.series('js'));
  gulp.watch(paths.posts, '*.html', gulp.series('watchPosts'));
});

gulp.task('default', gulp.series('html', 'css', 'watchPosts', 'js'));