var fs = require('fs');
var path = require('path');
var input = process.argv[2];
var output = process.argv[3];

var inputFile = path.join(process.cwd(), input);
try {
    var content = JSON.parse(fs.readFileSync(inputFile));
} catch (error) {
    throw new Error('File ' + input + ' does not exists.');
}

var data = content.ValCurs.Record.map(function (record) {
    console.log(record);
    return {
        date: record.Date,
        value: parseFloat(record.Value.replace(',', '.'))
    }
});

var rates = {
    data: data,
    length: data.length
}

var outputFile = path.join(process.cwd(), output);
fs.writeFileSync(outputFile, JSON.stringify(rates));
