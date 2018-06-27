var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var liveServer = require('gulp-live-server');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var CSS_DIST_PATH = 'dist/css';
var SCSS_PATH = 'src/scss/**/*.scss';

gulp.task('sass', () => {
    return gulp.src(SCSS_PATH)
        .pipe(plumber(function(err) {
            console.log('Styles error.');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            //outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(CSS_DIST_PATH))
        // .pipe(reload({stream:true}))
        .pipe(livereload());
});

gulp.task('serve', function() {
    var server = liveServer.static('dist/', 8888);
    server.start();
    .pipe(livereload());
});

gulp.task('copy', function () {
    gulp
     .src('local/**/*')
     .pipe(gulp.dest('dist'));
});

gulp.task('default', ['sass', 'serve', 'copy'], function() {
    livereload.listen();
    gulp.watch(SCSS_PATH, ['sass']);
})