var map; //gmaps
var json; // variable for geojson
var base = 'pollud_failide_formaat.zip'; // source of shhapefile
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
        "|fillcolor:0x" + usedColors[utf8fy(feature.getProperty(propertyToGroupBy))].replace("#", "") + "|weight:2|";

    feature.getGeometry().forEachLatLng(function (e) {
        paths += e.toUrlValue() + "|"

    });
    paths = paths.slice(0, -1);

    var url = "https://maps.googleapis.com/maps/api/staticmap?size=400x400&path="+paths+"&key="+apiKey;

    return url;
}

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3),
        mapTypeId: 'terrain'
    });

    var bounds = new google.maps.LatLngBounds();
    map.data.addListener('addfeature', function(e) {
        //console.log(e.feature.getGeometry());
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
        //console.log(!(crop in cropColors));
        if (!(crop in usedColors)) usedColors[crop] = colors.shift();
        return {
            fillColor: usedColors[crop],
            strokeColor: usedColors[crop],
            strokeWeight: 2
        }
    });
    console.log(json);


    var infowindow = new google.maps.InfoWindow({
        content: content
    });

    map.data.addListener('mouseover', function (event) {
        //console.log(event.feature.getProperty('kultuur'));
    });
    map.data.addListener('click', function (event) {
        infowindow.setContent(utf8fy(event.feature.getProperty('kultuur')));
        infowindow.setPosition(event.latLng);

        infowindow.open(map, this);

    });

    infowindow.addListener('click', function (event) {
        infowindow.close();
    });





}