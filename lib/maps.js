var map; //gmaps
var json; // variable for geojson
var base = 'pollud_failide_formaat.zip'; // source of shhapefile
shp(base).then(function (data) { //use converter to get geojson
    json = data; //assign geojson to the variable
});
var apiKey = "AIzaSyBB1FT6Dr2smPRmiJvEsZOw9hVefc7HGjM";
var propertyToGroupBy = 'kultuur';
var usedColors = {};
var colors = [
    'red',
    'blue',
    'orange',
    'green',
    'yellow',
    'teal',
    'gray',
    'navy',
    'maroon',
    'aqua',
    'fuchsia',
    'olive',
    'purple',
    'lime',
    'silver',
    'black',
    'white'

];


var content = '<div id="content"> <p> Hello there </p> </div>';

function utf8fy(string) {
    return decodeURIComponent(escape(string));
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


    function processPoints(geometry, callback, thisArg) {
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


    map.data.addListener('click', function (event) {
        infowindow.setContent("<b>Kultuur:</b> " + utf8fy(event.feature.getProperty('kultuur')) + "<br/>" + "<b>Pindala: </b>" + event.feature.getProperty('pindala') + " ha");
        infowindow.setPosition(event.latLng);
        map.data.overrideStyle(event.feature, {strokeWeight: 4});
        infowindow.open(map, this);

    });


    google.maps.event.addListener(infowindow,'closeclick',function(){
        console.log("SIIN");
    });


}