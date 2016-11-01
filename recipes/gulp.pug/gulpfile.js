var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var pug         = require('gulp-pug');
// var data        = require('gulp-data');
var reload      = browserSync.reload;

/*
  Get data via JSON file
*/

var YOUR_LOCALS = {};// makeContext();

gulp.task('context', function() {
  return gulp.src('data/example.json')
        .pipe(function(file, encoding, callback) {
            console.log("Context changed:", file.content);
            // YOUR_LOCALS = file.content;
            callback();
            return file;
    });
});

/**
 * Compile pug files into HTML
 */
gulp.task('templates', function() {


    return gulp.src('./app/*.pug')
        .pipe(pug({
            locals: YOUR_LOCALS
        }))
        .pipe(gulp.dest('./dist/'));
});

/**
 * Important!!
 * Separate task for the reaction to `.pug` files
 */
gulp.task('pug-watch', ['templates'], reload);

/**
 * Sass task for live injecting into all browsers
 */
gulp.task('sass', function () {
    return gulp.src('./app/scss/*.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(gulp.dest('./dist/css'))
        .pipe(reload({stream: true}));
});

/**
 * Serve and watch the scss/pug files for changes
 */
gulp.task('default', ['sass', 'context', 'templates'], function () {

    browserSync({server: './dist'});


    gulp.watch('./app/scss/*.scss', ['sass']);
    gulp.watch('./data/**/*.json', ['context', 'pug-watch']);
    gulp.watch('./app/*.pug',      ['pug-watch']);
});
