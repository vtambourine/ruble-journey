var eurDynamics = JSON.parse(document.getElementById('eur').innerHTML);
var usdDynamics = JSON.parse(document.getElementById('usd').innerHTML);

var path = [];
var steps = Math.min(eurDynamics.length, usdDynamics.length);

for (var i = 0; i < steps; i++) {
    path.push([usdDynamics.data[i].value, eurDynamics.data[i].value]);
}

var map;
ymaps.ready(function () {
    map = new ymaps.Map("ymaps", {
        center: [50, 37],
        zoom: 5,
        controls: ['zoomControl']
    });

    var lineStringGeometry = new ymaps.geometry.LineString(path, {
        geodesic: true
    });

    var lineStringGeoObject = new ymaps.GeoObject({
        geometry: lineStringGeometry,
        properties: {}
    }, {
        strokeColor: 'ff0000ff',
        strokeWidth: 2
    });

    map.geoObjects.add(lineStringGeoObject);

    console.log('bounds', lineStringGeometry.getBounds());
    map.setBounds(lineStringGeometry.getBounds());

    var placemark = new ymaps.Placemark(path[path.length - 1], {
        iconContent: 'Сегодня'
    }, {
        preset: "islands#redStretchyIcon"
    });
    map.geoObjects.add(placemark);

    var placemark = new ymaps.Placemark(path[0], {
        iconContent: 'Год назад'
    }, {
        preset: "islands#blueStretchyIcon"
    });
    map.geoObjects.add(placemark);
});
