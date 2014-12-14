var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js');

var source = process.argv[2];
var destination = process.argv[3];

if (!destination || !source) {
    throw new Error('Invalid arguments.');
}

var parser = new xml2js.Parser();
fs.readFile(path.resolve(__dirname, source), function (err, data) {
    parser.parseString(data, function (err, result) {
        fs.writeFileSync(path.resolve(__dirname, destination), JSON.stringify(parseCurrencyDynamics(result)));
    });
});

var parseCurrencyDynamics = function (data) {
    var data = data.ValCurs.Record.map(function (record) {
        return {
            date: record.$.Date,
            value: parseFloat(record.Value[0].replace(',', '.'))
        }
    });
    return {
        data: data,
        length: data.length
    }
}
