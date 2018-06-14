var gulp = require('gulp');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

var CSS_DIST_PATH = 'css/';
var SCSS_PATH = 'scss/**/*.scss';

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
        .pipe(livereload());
});

gulp.task('default', ['sass'], function() {
    livereload.listen();
    gulp.watch(SCSS_PATH, ['sass']);
})