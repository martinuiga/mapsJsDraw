/**
 * Values that need to be set before using the library
 *
 * "apiKey" - Your Google Application key
 * "propertyToGroupBy" - Name of the property that is used to group different areas
 * "importFileInputId" - Id of the file import input. The path of the .zip to be imported is acquired through this
 * "importFileButtonId" - Id of the button that is used to execute the file import.
 * "createNewFieldButtonId" - Id of the button that starts the new area creation process
 */
var propertyToGroupBy = 'kultuur';
var importFileInputId = 'fileLocation';
var importFileButtonId = 'import';
var createNewFieldButtonId = 'makeField';
var editAreaButtonId = 'editField';
//var toolTipOnHover = false;
/**
 * *******************************************************************************************************************
 * *******************************************************************************************************************
 */
var maps = {}

maps._selectedAreas = [];
maps._usedColors = {};
maps._colors = [ //TODO need to make colors system better
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

// maps.build = function(apiKey) {
//   maps.apiKey = "AIzaSyB7zuj9eaZkKbg7r0hWr_5Hbk70HPQeCLA";
//   var script = document.createElement('script');
//   script.src = "https://maps.googleapis.com/maps/api/js?key=" + maps.apiKey + "&libraries=geometry&callback=maps.initialize";
//   document.getElementsByTagName('head')[0].appendChild(script);
// }

/**
 * Function that needs to be the callback when including Google Maps in an HTML file
 */
maps.initialize = function() {
  maps._map = maps.createMap('map', 'satellite');
  maps.fitAreasOnScreen();
  maps.loadDataFromLocalStorage();
  //maps.listenForAreaSelections({"kultuur" : "rukis, v.a sangaste rukis, liblikõieliste allakülviga"});   delete
  // TODO do not hardcode buttons - buttons should register to the maps API
  // createNewArea(map, createNewFieldButtonId);
  // checkMarkOnClick(map);
  // displayAreasByProperty(map, "kultuur", "punane ristik (100% ristikut)");
  // map.data.addListener('click', function(e) { //here only for testing
  //     console.log(getScreenshot(e.feature));
  // });
}

/*function bindDataLayerListeners(dataLayer) {
    dataLayer.addListener('addfeature', savePolygon);
    dataLayer.addListener('removefeature', savePolygon);
    dataLayer.addListener('setgeometry', savePolygon);
}*/

/**
 * Creates a new Google Map. Needs id of the HTML div where the map is going to be and also the map type (terrain,
 * satellite, hybrid)
 * @param idOfDiv
 * @param mapType
 * @return {google.maps.Map}
 */
maps.createMap = function(idOfDiv, mapType) {
  return new google.maps.Map(document.getElementById(idOfDiv), {
    mapTypeId: mapType,
    center: new google.maps.LatLng(59.436962, 24.753574),
    zoom: 7
  });
}

/**
 * Loads polygons from localStorage and inserts them onto the map
 * @param map
 */
maps.loadDataFromLocalStorage = function() {
  var data = JSON.parse(localStorage.getItem('geoData'));
  maps._map.data.forEach(function (f) {
      maps._map.data.remove(f);
  });
  maps.importGeoJson(data);
}

/**
 * Saves polygons on the map to localStorage
 * TODO should receive callback to call for saving
 * @param map
 */
maps.savePolygon = function() {
  maps._map.data.toGeoJson(function (json) {
    localStorage.setItem('geoData', JSON.stringify(json));
  });
}

/**
 * Creates a new area on the map
 * @param map
 * @param buttonId
 */
maps.createNewArea = function() {
    maps._map.data.setDrawingMode('Polygon');
    maps._map.data.addListener('addfeature', function () {
      maps._map.data.setDrawingMode(null);
      maps.savePolygon();
    });
}

/**
 * Imports the GeoJSON data to map
 * @param map
 * @param inputId
 * @param buttonId
 */
maps.importGeoJson = function(data) {
  maps._map.data.addGeoJson(data);
  maps.groupAreasByProperty(propertyToGroupBy);
}

/**
 * Adds areas to selection array based on given criteria
 * TODO FIXME
 * Example usage: maps.listenForAreaSelections({"kultuur" : "rukis, v.a sangaste rukis, liblikõieliste allakülviga"});
 * @param propValue
 */
maps.listenForAreaSelections = function (callback) {
  maps._map.data.addListener("click", function (event) {
    id = event.feature.getProperty("id");
    var index = -1
    if ((index = maps._selectedAreas.indexOf(id)) == -1){
      // TODO add some paint
      maps._selectedAreas.push(id);
    }else{
      // TODO remove some paint
      maps._selectedAreas.splice(index, 1);
    }
    callback(maps._selectedAreas);
  })
}

maps.clearSelectedAreas = function () {
  maps._selectedAreas = [];
}

maps.getSelectedAreas = function () {
  return maps._selectedAreas;
}

maps.displayAreasByProperty = function(property, propertyValue) {
  maps._map.data.forEach(function (f) {
    if (f.getProperty(property) != propertyValue) {
      maps._map.data.remove(f);
    }
  });
}

/**
 * Groups areas on the map by a property
 * @param map
 * @param property
 */
maps.groupAreasByProperty = function(property) {
  maps._map.data.setStyle(function (feature) {
    var propContent = utf8fy(feature.getProperty(property));
    if (!(propContent in maps._usedColors)) maps._usedColors[propContent] = maps._colors.shift();
    return {
        fillColor: maps._usedColors[propContent],
        strokeColor: maps._usedColors[propContent],
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
maps.processPoints = function(geometry, callback, thisArg) {
    if (geometry instanceof google.maps.LatLng) {
        callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
        callback.call(thisArg, geometry.get());
    } else {
        geometry.getArray().forEach(function(g) {
            maps.processPoints(g, callback, thisArg);
        });
    }
}

/**
 * Fits every are on the map onto the screen.
 * @param map
 */
maps.fitAreasOnScreen = function() {
  var bounds = new google.maps.LatLngBounds();
  maps._map.data.addListener('addfeature', function(e) {
      maps.processPoints(e.feature.getGeometry(), bounds.extend, bounds);
      maps._map.fitBounds(bounds);
  });
}

maps.editArea = function(event, buttonId, infowindow) {
  var button = document.getElementById(buttonId);
  button.addEventListener("click", function() {

    maps._map.data.overrideStyle(event, {editable: true});
    infowindow.setContent(
      "<b>Kultuur:</b> " + utf8fy(event.getProperty('kultuur')) + "<br/>" +
      "<b>Pindala: </b>" + event.getProperty('pindala') + " ha" + "<br/>" +
      "<p>" + "<button id='editAreaDone'>" + "DONE" + " </button>" + "</p>"
    );

    var buttonDone = document.getElementById("editAreaDone");
    buttonDone.addEventListener("click", function() {
      maps._map.data.overrideStyle(event, {editable: false});
      maps.savePolygon();
      infowindow.close();
    });

    infowindow.addListener("closeclick", function () {
      maps._map.data.overrideStyle(event, {editable: false});
      maps.loadDataFromLocalStorage();
      infowindow.close();
    });
  });
}

/**
 * Enables showing tooltips when clicking on an area
 * @param options: array which contains options for the tooltip (hover : boolean, propertiesToDisplay : object,
 * editable : boolean)
 */
maps.setupInfoWindow = function (options) {
  var hover = false;
  var propertiesToDisplay = {};
  var editable = false;

  if ('hover' in options && (options['hover'] == true || options['hover'] == false)) {
    hover = options['hover'];
  }
  if ('properties' in options && options['properties'] != undefined) {
    propertiesToDisplay = options['properties'];
  }
  if ('editable' in options && (options['editable'] == true || options['editable'] == false)) {
    editable = options['editable'];
  }
  maps.getInfoWindowforArea(hover, propertiesToDisplay, editable);
}

/**
 * Generates a tooltip when clicking on an area
 * @param toolTipOnHover
 * @param properties: properties to display in content
 * @param editable
 */
maps.getInfoWindowforArea = function(toolTipOnHover, properties, editable) {
  var ev;
  var content;

    if (toolTipOnHover) {
        ev = 'mouseover';
    } else {
        ev = 'click';
    }
    var infowindow = new google.maps.InfoWindow({});
    maps._map.data.addListener(ev, function (event) {
      content = "";
      for (i = 0; i < properties.length; i++) {
        if (!(event.feature.getProperty(properties[i]) == undefined)) {
          content += "<b> "+ properties[i] + ":</b> " + utf8fy(event.feature.getProperty(properties[i])) + "<br/>";
        }
      }

      if (editable) content += "<p>" + "<button id='editArea'>" + "CLICK ME TO EDIT FIELD" + " </button>" + "</p>";

      infowindow.close();
      infowindow.setContent(
        content
      );

      infowindow.setPosition(event.latLng);
      infowindow.open(maps._map, this);
      if (editable) maps.editArea(event.feature, 'editArea', infowindow);


  });

  infowindow.addListener("closeclick", function () {
    content = "";
    infowindow.close();

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
            googleMaps.data.overrideStyle(event.feature, {strokeWeight: 2});
        } else {
            event.feature.setProperty('selected', 1);
            var newCircle = new google.maps.Circle({
                strokeColor: 'green',
                strokeOpacity: 1,
                strokeWeight: 2,
                fillColor: 'green',
                fillOpacity: 0.8,
                center: event.latLng,
                radius: 50,
                map: googleMaps
            });
            cityCircle[event.feature.getProperty('pollunr')] = newCircle;
            googleMaps.data.overrideStyle(event.feature, {strokeWeight: 6});
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
    var paths = "color:0x" + maps._usedColors[utf8fy(feature.getProperty(propertyToGroupBy))].replace("#", "") +
        "|fillcolor:0x" + maps._usedColors[utf8fy(feature.getProperty(propertyToGroupBy))].replace("#", "") + "|weight:2|enc:";
    var latlngs = [];

    feature.getGeometry().getArray()[0].forEachLatLng(function (e) {
        latlngs.push(new google.maps.LatLng(parseFloat(e.lat()), parseFloat(e.lng())));
    });
    paths += google.maps.geometry.encoding.encodePath(latlngs);

    return "https://maps.googleapis.com/maps/api/staticmap?format="+format+"&size="+size+"&path="+paths+"&key="+maps._apiKey;
}

/**
 * Displays estonian unique letters properly
 * @param string
 * @returns {string}
 */
function utf8fy(string) {
    return decodeURIComponent(escape(string));
}


// Just a random v11



