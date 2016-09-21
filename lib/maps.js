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

/**
 * Function that needs to be the callback when including Google Maps in an HTML file
 */
function initialize() {
    var map = createMap('map', 'terrain');
    importGeoJson(map, 'pollud_failide_formaat.zip');
    loadPolygons(map);
    fitAreasOnScreen(map);
    groupAreasByProperty(map, propertyToGroupBy);
    getInfoWindowforArea(map);
    checkMarkOnClick(map);
    createNewArea(map, "makeField");

}

function createNewArea(map, buttonid) {

    var button = document.getElementById(buttonid);

    button.addEventListener("click", function() {

        map.data.setDrawingMode('Polygon');
        map.data.addListener('addfeature', function (event) {
            map.data.setDrawingMode(null);
            savePolygon(map);
        });
    });

}

function bindDataLayerListeners(dataLayer) {
    dataLayer.addListener('addfeature', savePolygon);
    dataLayer.addListener('removefeature', savePolygon);
    dataLayer.addListener('setgeometry', savePolygon);
}


function loadPolygons(map) {
    var data = JSON.parse(localStorage.getItem('geoData'));
    map.data.forEach(function (f) {
        map.data.remove(f);
    });
    map.data.addGeoJson(data);
}


function savePolygon(map) {
    map.data.toGeoJson(function (json) {
        localStorage.setItem('geoData', JSON.stringify(json));
    });
}


/**
 * Creates a new Google Map. Needs id of the HTML div where the map is going to be and also the map type (terrain,
 * satellite, hybrid)
 * @param idOfDiv
 * @param mapType
 * @return {google.maps.Map}
 */
function createMap(idOfDiv, mapType) {
    return new google.maps.Map(document.getElementById(idOfDiv), {
        mapTypeId: mapType
    });
}

/**
 * Imports a .zip containing Shapefile to the inputted map
 * @param map
 * @param baseFile
 */
function importGeoJson(map, baseFile) {
    shp(baseFile).then(function (data) { //use converter to get geojson
        map.data.addGeoJson(data); //assign geojson to the variable
    });
}

/**
 * Groups areas on the map by a property
 * @param map
 * @param property
 */
function groupAreasByProperty(map, property) {
    map.data.setStyle(function (feature) {
        var propContent = utf8fy(feature.getProperty(property));
        if (!(propContent in usedColors)) usedColors[propContent] = colors.shift();
        return {
            fillColor: usedColors[propContent],
            strokeColor: usedColors[propContent],
            strokeWeight: 2
        }
    });
}

/**
 * Processes area coordinates that are on the map
 * @param geometry
 * @param callback
 * @param thisArg
 */
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

/**
 * Fits every are on the map onto the screen.
 * @param map
 */
function fitAreasOnScreen(map) {
    var bounds = new google.maps.LatLngBounds();
    map.data.addListener('addfeature', function(e) {
        processPoints(e.feature.getGeometry(), bounds.extend, bounds);
        map.fitBounds(bounds);
    });
}

/**
 * Generates a tooltip when clicking on an area
 * @param googleMaps
 */
function getInfoWindowforArea(googleMaps) {
    var infowindow = new google.maps.InfoWindow({
    });
    googleMaps.data.addListener('click', function (event) {
        infowindow.setContent("<b>Kultuur:</b> " + utf8fy(event.feature.getProperty('kultuur')) + "<br/>" + "<b>Pindala: </b>" + event.feature.getProperty('pindala') + " ha");
        infowindow.setPosition(event.latLng);

        googleMaps.data.overrideStyle(event.feature, {strokeWeight: 6});
        infowindow.open(googleMaps, this);

        infowindow.addListener('closeclick',function () {
            googleMaps.data.overrideStyle(event.feature, {strokeWeight: 2});
        });
    });
}

var cityCircle = {}; //TODO This needs to go in a better place or sth
/**
 * Generates a checkmark on a selected area
 * @param googleMaps
 */
function checkMarkOnClick(googleMaps) {
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
                map: googleMaps
            });
            cityCircle[event.feature.getProperty('pollunr')] = newCircle;
        }
        //console.log(cityCircle);
    });
}

/**
 * Returns Google Static Maps picture url for the input feature. Size parameter default value is "400x400". Format
 * default value is "png"
 * @param {Feature} feature
 * @param {String} size
 * @param {String} format
 * @return {String} url
 */
function getScreenshot(feature, size, format) {
    size = size || "400x400";
    format = format || "png";
    var paths = "color:0x" + usedColors[utf8fy(feature.getProperty(propertyToGroupBy))].replace("#", "") +
        "|fillcolor:0x" + usedColors[utf8fy(feature.getProperty(propertyToGroupBy))].replace("#", "") + "|weight:2|enc:";
    var latlngs = [];

    feature.getGeometry().getArray()[0].forEachLatLng(function (e) {
        latlngs.push(new google.maps.LatLng(parseFloat(e.lat()), parseFloat(e.lng())));
    });
    paths += google.maps.geometry.encoding.encodePath(latlngs);

    return "https://maps.googleapis.com/maps/api/staticmap?format="+format+"&size="+size+"&path="+paths+"&key="+apiKey;
}

/**
 * Displays estonian unique letters properly
 * @param string
 * @returns {string}
 */
function utf8fy(string) {
    return decodeURIComponent(escape(string));
}



