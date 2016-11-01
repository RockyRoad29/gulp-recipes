var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var pug         = require('gulp-pug');
var data        = require('gulp-data');
var fs          = require('fs');
var path        = require('path');
var reload      = browserSync.reload;

/**
 * Compile pug files into HTML
 */
gulp.task('templates', function() {


    return gulp.src('./app/**/*.pug')
    // get suitable context for each .pug file
        .pipe(data(function(file) {
            var ctx = './data/'  + path.basename(file.path).replace(/\.pug$/,'.json');
            console.log("Loading context for %s: %s", file.path, ctx);
            var data = fs.readFileSync(ctx, {encoding:'utf-8'});
            // console.log("data: %j", data);
            return JSON.parse(data);
        }))
        .pipe(pug(
            // FIXME all loaded contexts are injected in every template
           {pretty: true}
        ))
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
gulp.task('default', ['sass', 'templates'], function () {

    browserSync({
        open: false,
        ui: false,
        server: './dist'
    });

    gulp.watch('./app/scss/*.scss', ['sass']);
    gulp.watch(['data/**/*.json','./app/**/*.pug'], ['pug-watch']);
});
