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
var runSequence = require('run-sequence');
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

// Serve files from the src/ folder of this project
gulp.task('browserSync-dev', () => {
    browserSync.init({
        server: "src"
    });
});

// Reload task
gulp.task('bs-reload', () => {
    browserSync.reload();
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
  const sassInput = 'src/scss/**';
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

gulp.task('watch', ['browserSync-dev','scss'], () => {
    /* Watch scss, run the sass task on change. */
    gulp.watch('app/scss/**/*.scss', ['scss'])
    .on('change', function(event){
        console.log('Le fichier SCSS ' + event.path + ' a ete modifie')
    });
     /* Watch JS files, run the scripts task on change. */
    gulp.watch('app/scripts/*.js', ['bs-reload'])
    .on('change', function(event){
        console.log('Le fichier JS ' + event.path + ' a ete modifie')
    });
    /* Watch .html files, run the bs-reload task on change. */
    gulp.watch('app/**/*.html', ['bs-reload'])
    .on('change', function(event){
        console.log('Le fichier HTML ' + event.path + ' a ete modifie')
    });
});

//Run DevServer with liveReload
gulp.task('run:dev' , (callback) => {
    runSequence(
        ['scss','browserSync-dev','watch'],
        callback)
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('src/scss/*.scss', ['scss']);
});



gulp.task('default', ['browser-sync', 'minify', 'scripts', 'scss', 'watch']);