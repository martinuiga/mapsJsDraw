var map; //gmaps
var json; // variable for geojson
var base = 'pollud_failide_formaat.zip'; // source of shapefile
shp(base).then(function (data) { //use converter to get geojson
    json = data; //assign geojson to the variable
});
var apiKey = "AIzaSyAxzRNiTQpXhXohl4MpAg-IYVZQyknyla4";
var propertyToGroupBy = 'kultuur';
var usedColors = {};
var colors = [ //TODO need to make colors system better
    '#FF0000',
    '#0000FF',
    '#FFA500',
    '#008000',
    '#FFFF00',
    '#008080',
    '#808080',
    '#000080',
    '#800000',
    '#00FFFF',
    '#FF00FF',
    '#808000',
    '#800080',
    '#00FF00',
    '#C0C0C0',
    '#000000',
    '#FFFFFF'

];

var content = '<div id="content"> <p> Hello there </p> </div>';
/**
 * Displays estonian unique letters properly
 * @param string
 * @returns {string}
 */
function utf8fy(string) {
    return decodeURIComponent(escape(string));
}

/**
 * Returns Google Static Maps picture url for the input feature
 * @param {Feature} feature
 * @return {String} url
 */
function getScreenshot(feature) { //TODO size, format, etc into parameters
    var paths = "color:0x" + usedColors[utf8fy(feature.getProperty(propertyToGroupBy))].replace("#", "") +
        "|fillcolor:0x" + usedColors[utf8fy(feature.getProperty(propertyToGroupBy))].replace("#", "") + "|weight:2|enc:";

    var latlngs = [];

    feature.getGeometry().getArray()[0].forEachLatLng(function (e) {
        latlngs.push(new google.maps.LatLng(parseFloat(e.lat()), parseFloat(e.lng())))/* += e.toUrlValue() + "|"*/;
    });

    paths += google.maps.geometry.encoding.encodePath(latlngs);

    var url = "https://maps.googleapis.com/maps/api/staticmap?size=400x400&path="+paths+"&key="+apiKey;

    return url;
}


function getInfoWindowforArea(googleMaps) {
    var infowindow = new google.maps.InfoWindow({
        content: content
    });

    googleMaps.data.addListener('click', function (event) {
        infowindow.setContent("<b>Kultuur:</b> " + utf8fy(event.feature.getProperty('kultuur')) + "<br/>" + "<b>Pindala: </b>" + event.feature.getProperty('pindala') + " ha");
        infowindow.setPosition(event.latLng);
        googleMaps.data.overrideStyle(event.feature, {strokeWeight: 6,});
        infowindow.open(googleMaps, this);

        infowindow.addListener('closeclick',function (e) {
            map.data.overrideStyle(event.feature, {strokeWeight: 2});
        });
    });
}
var cityCircle = {};
function checkMarkonClick(googleMaps) {
    googleMaps.data.addListener('click', function (event) {
        if (event.feature.getProperty('selected') == 1) {
            cityCircle[event.feature.getProperty('pollunr')].setMap(null);
            cityCircle[event.feature.getProperty('pollunr')] = null;
            event.feature.removeProperty('selected');
        } else {
            event.feature.setProperty('selected', 1);
            var newCircle = new google.maps.Circle({
                strokeColor: 'green',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: 'green',
                fillOpacity: 0.35,
                center: event.latLng,
                radius: 50,
                map: map
            });
            cityCircle[event.feature.getProperty('pollunr')] = newCircle;

        }

        console.log(cityCircle);
    });

}

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3),
        mapTypeId: 'terrain'
    });

    var bounds = new google.maps.LatLngBounds();
    map.data.addListener('addfeature', function(e) {
        processPoints(e.feature.getGeometry(), bounds.extend, bounds);
        map.fitBounds(bounds);
    });


    function processPoints(geometry, callback, thisArg) { //TODO move this out of initialize() if possible
        if (geometry instanceof google.maps.LatLng) {
            callback.call(thisArg, geometry);
        } else if (geometry instanceof google.maps.Data.Point) {
            callback.call(thisArg, geometry.get());
        } else {
            geometry.getArray().forEach(function(g) {
                processPoints(g, callback, thisArg);
            });
        }
    }

    map.data.addGeoJson(json); //load does not work with local files, so addGgeoJson is used
    map.data.setStyle(function (feature) {
        var crop = utf8fy(feature.getProperty(propertyToGroupBy));
        if (!(crop in usedColors)) usedColors[crop] = colors.shift();
        return {
            fillColor: usedColors[crop],
            strokeColor: usedColors[crop],
            strokeWeight: 2
        }
    });
    console.log(json);


    getInfoWindowforArea(map);
    checkMarkonClick(map);



}