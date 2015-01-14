var fs = require('fs');
var path = require('path');
var format = require('util').format;
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var xml2json = require('gulp-xml2json');
var request = require('superagent');
var gulp = require('gulp');

var DATA_PATH = './data';

var CODES = {
    usd: 'R01235',
    eur: 'R01239'
};

function getFormattedDate(date) {
    return format('%s/%s/%s', date.getDate(), date.getMonth() + 1, date.getFullYear());
}

function getCurrencyDynamicUrl(currency, start, end) {
    return encodeURI(format(
        'http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=%s&date_req2=%s&VAL_NM_RQ=%s',
        getFormattedDate(start),
        getFormattedDate(end),
        CODES[currency]
    ))
}

function getCurrencyDynamicFilename(currency, start, end) {
    return format('%s-%s.%s.dynamic.xml', getFormattedDate(end), getFormattedDate(start), currency).replace(/\//g, '');
}

var getCurrencyDynamic = function (currency) {
    var end = new Date(Date.now() + 1000 * 60 * 60 * 24);
    var start = new Date(end.getTime() - 1000 * 60 * 60 * 24 * 365 * 1);

    var filename = getCurrencyDynamicFilename(currency, start, end);
    var stream = source(filename);
    var file = path.join(process.cwd(), DATA_PATH, filename);

    fs.exists(file, function (exists) {
        if (exists) {
            fs.readFile(file, function (error, data) {
                if (error) throw error;
                stream.write(data);
                stream.end();
            })
        } else {
            console.log(getCurrencyDynamicUrl(currency, start, end));
            request
                .get(getCurrencyDynamicUrl(currency, start, end))
                .end(function (error, response) {
                    fs.writeFile(file, response.text, function (error) {
                        if (error) throw error;
                        stream.write(response.text);
                        stream.end();
                    });
                })
        }
    });

    return stream
        .pipe(buffer())
        .pipe(xml2json())
        .pipe(gulp.dest(DATA_PATH));
}

module.exports = getCurrencyDynamic;
