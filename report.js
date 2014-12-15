var request = require('superagent');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var eurDynamics = require('./data/usd-current-dynamic.json').data;
var usdDynamics = require('./data/eur-current-dynamic.json').data;

var currentCoordinates = [
    usdDynamics[eurDynamics.length - 1].value,
    eurDynamics[eurDynamics.length - 1].value
];

var geocodeUrl = 'http://geocode-maps.yandex.ru/1.x/?format=json&geocode=' + currentCoordinates.join(',');

console.log(geocodeUrl);


/*
request
    .get(geocodeUrl)
    .end(function (result) {
        var data = JSON.parse(result.text);
        parsePosition(data.response.GeoObjectCollection);
    });
*/

var data = require('./data/geocoder.json');
parsePosition(data.response.GeoObjectCollection)

function parsePosition(data) {
    console.log(data);
    var features = data.featureMember;
    var street, area;
    /*features.forEach(function (feature) {
        var name = feature.GeoObject.name;
        var kind = feature.GeoObject.metaDataProperty.GeocoderMetaData.kind;
        console.log(kind);
        switch (kind) {
            case 'street':
                street = name;
                break;
            default:
                area = name;
        }
    });*/
    if (features && features.length) {
        var location = features[0].GeoObject.metaDataProperty.GeocoderMetaData.text
            .split(', ')
            .reverse()
            .splice(0, 2);

        //console.log(location);
        Promise.all(location.map(function (word) {
            return getPrepositiv(word);
        })).then(function (result) {
            text = 'Рубль сейчас находится в ';
            text += result.join(', ');
            text += '.';
            console.log(text);
        })
    }
}

function getPrepositiv(word) {
    return new Promise(function(resolve, reject) {
        request
            .get('http://api.morpher.ru/WebService.asmx/GetXml?s=' + encodeURI(word))
            .end(function (data) {
                //console.log(data.text);
                parser.parseString(data.text, function (err, result) {
                    if (err) throw err
                    resolve(result.xml['П'])
                });
            });
    })
}
