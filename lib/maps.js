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

    })


}