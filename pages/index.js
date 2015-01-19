var eurRates = JSON.parse(document.getElementById('eur').innerHTML);
var usdRates = JSON.parse(document.getElementById('usd').innerHTML);

var path = [];
var steps = Math.min(eurRates.length, usdRates.length);

for (var i = 0; i < steps; i++) {
    path.push([usdRates.data[i].value, eurRates.data[i].value]);
}

ymaps.ready(function () {
    var map = new ymaps.Map("ymaps", {
        center: [50, 37],
        zoom: 5,
        controls: ['zoomControl']
    });

    var segmentColor = 'ff0000';

    var segments = 16;
    var step = Math.ceil(path.length/segments);
    for (var i = 0; i < segments; i++) {
        var segment = path.slice(
            i * step,
            (i + 1) * step + 1
        );

        var lineStringGeometry = new ymaps.geometry.LineString(segment, {
            geodesic: true
        });

        var lineStringGeoObject = new ymaps.GeoObject({
            geometry: lineStringGeometry,
            properties: {}
        }, {
            strokeColor: segmentColor + (Math.ceil((255 - 32) / (segments - i)) + 32).toString(16),
            strokeWidth: 2
        });

        map.geoObjects.add(lineStringGeoObject);
    }

    map.setBounds(lineStringGeometry.getBounds());

    var placemark = new ymaps.Placemark(path[path.length - 1], {
        iconContent: 'Сегодня'
    }, {
        preset: "islands#redStretchyIcon"
    });
    map.geoObjects.add(placemark);

    /*var placemark = new ymaps.Placemark(path[0], {
        iconContent: 'Год назад'
    }, {
        preset: "islands#blueStretchyIcon"
    });
    map.geoObjects.add(placemark);*/
});
