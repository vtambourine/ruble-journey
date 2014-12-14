var fs = require('fs');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var del = require('del');

var paths = {
    scripts: ['client/**/*.js'],
    template: ['client/index.html'],
    dest: 'public'
};

gulp.task('default', function() {
    console.log('gulp');
});

gulp.task('clean', function(cb) {
    del(['public'], cb);
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src(paths.scripts)
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest));
});

var usd = require('./data/usd-current-dynamic.json');
var eur = require('./data/eur-current-dynamic.json');

gulp.task('templates', function() {
    return gulp.src(paths.template)
        .pipe(replace('{{ USD }}', JSON.stringify(usd)))
        .pipe(replace('{{ EUR }}', JSON.stringify(eur)))
        .pipe(gulp.dest(paths.dest));
});

gulp.task('default', ['scripts', 'templates']);
