var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var browserify = require('gulp-browserify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');

    gulp.task('browser-sync', function() {
      browserSync.init({
          server: {
              baseDir: "./src"
          }
      });
  });


gulp.task('default', function() {
  console.group('default task of gulp');
  var number1 = 5;
  console.log('The first number is ' + number1);
  var number2 = 10;
  console.log('The second number is ' + number2);
  var sum = number1 + number2;
  console.log('The sum is ' + sum);
  console.groupEnd();
});

gulp.task('clean:trash', function() {
  return del([
      'trash/**/*',
      '!trash/styles.css',
  ]);
});

gulp.task('minify', () =>
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);

gulp.task('scripts', function() {
  gulp.src('src/js/app.js')
    .pipe(browserify({
      insertGlobals: true,
      debug :!gulp.eventNames.production
    }))
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('scss', () => {
  const sassInput = 'src/scss/styles.scss';
  const cssOutput = 'src/css';

  return gulp.src(sassInput)
      .pipe(sourcemaps.init())
        .pipe(changed(cssOutput))
    	.pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer(
            {
                browsers: [
                    '> 1%',
                    'last 2 versions',
                    'firefox >= 4',
                    'safari 7',
                    'safari 8',
                    'IE 8',
                    'IE 9',
                    'IE 10',
                    'IE 11'
                ],
                cascade: false
            }
        ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssOutput))
        
        /* Reload the browser CSS after every change */
        .pipe(reload({stream:true}));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/scss/*.scss', ['scss']);
});



gulp.task('default', ['browser-sync', 'clean:trash', 'minify', 'scripts', 'scss', 'watch']);