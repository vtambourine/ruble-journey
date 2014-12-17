var Stream = require('stream');

var parseDynamic = function () {
    var stream = new Stream.Transform({objectMode: true});

    stream._transform = function (file, encoding, callback) {
        var content = JSON.parse(file.contents.toString());

        var data = content.ValCurs.Record.map(function (record) {
            return {
                date: record.$.Date,
                value: parseFloat(record.Value[0].replace(',', '.'))
            }
        });

        var dynamic = {
            data: data,
            length: data.length
        }

        file.contents = new Buffer(JSON.stringify(dynamic))
        callback(null, file);
    }

    return stream;
}

module.exports = parseDynamic;
