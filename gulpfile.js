var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var format = require('util').format;
var gulp = require('gulp');
var es = require('event-stream');
var del = require('del')
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var getCurrencyDynamic = require('./plugins/get-currency-dynamic');
var parseDynamic = require('./plugins/parse-dynamic');

var DATA_PATH = './data';
var PAGES_PATH = './pages';
var BUILD_PATH = './build';

gulp.task('dynamic', function () {
    mkdirp(path.resolve(__dirname, DATA_PATH));
    ['usd', 'eur'].forEach(function (currency) {
        getCurrencyDynamic(currency)
            .pipe(parseDynamic())
            .pipe(rename('current.' + currency + '.dynamic.json'))
            .pipe(gulp.dest(DATA_PATH));
    });
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src(path.resolve(__dirname, PAGES_PATH, '*.js'))
        .pipe(uglify())
        .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('templates', ['scripts', 'clean'], function() {
    var usd = require('./data/current.usd.dynamic.json');
    var eur = require('./data/current.eur.dynamic.json');

    mkdirp(path.resolve(__dirname, BUILD_PATH));
    return gulp.src(path.resolve(__dirname, PAGES_PATH, '*.html'))
        .pipe(replace('{{ USD }}', JSON.stringify(usd)))
        .pipe(replace('{{ EUR }}', JSON.stringify(eur)))
        .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('clean', function(next) {
    del([BUILD_PATH], next);
});

gulp.task('watch', function() {
    gulp.watch(PAGES_PATH, ['pages']);
});

gulp.task('default', ['templates']);
