//2016/2/11 Mike
var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');




//重置
gulp.task('clean', function() {
    return del(['build']);
});

// Sass編譯任務
gulp.task('sass', ['clean'], function() {
    return gulp.src(['./dev/scss/**.scss'])
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({
                // outputStyle: 'nested'
                outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(minifycss({ keepSpecialComments: 1 }))
        .pipe(gulp.dest('./css/'))
});

//Js壓縮任務
gulp.task('mizjs', ['clean'], function() {
    return gulp.src(['./dev/js/**.js'])
        // .pipe(uglify({output: {comments: /^!|@preserve|@license|@cc_on/i}}))
        .pipe(sourcemaps.init())
        .pipe(concat('mizJs.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./js/'));
});



//任務"css"負責'sass'這個版型相關的編譯任務
gulp.task('css', ['sass']);
//任務"mizjs"負責'js壓縮任務
gulp.task('js', ['mizjs']);

gulp.task('default', ['css', ], function() {
    gulp.watch('./dev/scss/**/**.scss', ['css']);
    gulp.watch('./dev/js/**/**.js', ['js']);
});



//轉檔任務
var lessToScss = require('gulp-less-to-scss');
gulp.task('lessToScss', function() {
    gulp.src('./dev/less2scss/less/*.less')
        .pipe(lessToScss())
        .pipe(gulp.dest('./dev/less2scss/scss'));
});
