/**
 * Values that need to be set before using the library
 *
 * "apiKey" - Your Google Application key
 * "propertyToGroupBy" - Name of the property that is used to group different areas
 * "importFileInputId" - Id of the file import input. The path of the .zip to be imported is acquired through this
 * "importFileButtonId" - Id of the button that is used to execute the file import.
 * "createNewFieldButtonId" - Id of the button that starts the new area creation process
 */

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

maps._propertyToGroupBy = '';
maps._selectedAreas = [];
maps._usedColors = {};
maps._allAreas = {};
maps._displayedAreas = {};
maps._editInPrgrs = false;
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

maps.buildLegend = function () {
  var legendDiv = document.createElement('div');
  legendDiv.id = 'legend';
  legendDiv.style.background = 'white';
  legendDiv.style.padding = '5px';
  legendDiv.style.margin = '10px';
  document.body.appendChild(legendDiv);
}

/**
 * Function that needs to be the callback when including Google Maps in an HTML file
 */
maps.initialize = function() {
  maps.buildLegend();
  maps._map = maps.createMap('map', 'hybrid');
  maps._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('legend'));
  maps.fitAreasOnScreen();
  // maps.loadDataFromLocalStorage();
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
  maps.importGeoJson(data, maps._propertyToGroupBy);
  maps._propertyToGroupBy = localStorage.getItem('propertyToGroupBy');
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
  localStorage.setItem('propertyToGroupBy', maps._propertyToGroupBy);
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
      // maps.savePolygon();
    });
}

/**
 * Imports the GeoJSON data to map
 * @param data
 * @param prop
 */
maps.importGeoJson = function(data, prop) {
  maps._map.data.addGeoJson(data);
  maps._allAreas = data;
  maps._propertyToGroupBy = prop;
  maps.groupAreasByProperty(maps._propertyToGroupBy);
  maps.savePolygon();
}

maps.deleteAreas = function (id, selected) {

  maps._map.data.forEach(function (e) {
    if ((e.getProperty('id') == id) && selected) maps._map.data.remove(e);
  });
  maps._allAreas.features.forEach(function (e) {
    if ((e.properties['id'] == id) && selected) maps._allAreas.features.splice(e,1);
  });

}

/**
 * Listens for area selections and passes the selected areas to the callback
 * @param callback
 */
maps.listenForAreaSelections = function (callback) {
  maps._map.data.addListener("click", function (event) {
    feature = event.feature;
    id = feature.getProperty("id");
    var index = -1;
    var selected = true;
    if ((index = maps._selectedAreas.indexOf(id)) == -1){
      maps._selectArea(id, feature);
    }else{
      maps._deselectArea(id, feature);
      selected = false
    }
    callback(id, selected);
  })
}

maps._selectArea = function(id, feature) {
  maps._selectedAreas.push(id);
  maps._map.data.overrideStyle(feature, {fillOpacity: 0.9});
}

maps._deselectArea = function(id, feature) {
  index = maps._selectedAreas.indexOf(id)
  maps._selectedAreas.splice(index, 1);
  maps._map.data.overrideStyle(feature, {fillOpacity: 0.3});
}

maps.selectAllAreas = function() {
  maps._map.data.forEach(function(feature) {
    maps._selectArea(feature.getProperty("id"), feature)
  })
}

maps.clearSelectedAreas = function () {
  maps._map.data.forEach(function(feature) {
    maps._deselectArea(feature.getProperty("id"), feature)
  })
}

maps.selectArea = function(id) {
  maps._map.data.forEach(function(feature) {
    propertyId = feature.getProperty("id");
    if (propertyId == id) {
      maps._selectArea(id, feature);
    }
  })
}

maps.deselectArea = function(id) {
  maps._map.data.forEach(function(feature) {
    propertyId = feature.getProperty("id");
    if (propertyId == id) {
      maps._deselectArea(id, feature);
    }
  })
}

maps.getSelectedAreas = function () {
  return maps._selectedAreas;
}

maps.displayAllAreas = function () {
  maps._map.data.forEach(function (f) {
    maps._map.data.remove(f);
  });
  //maps.loadDataFromLocalStorage();
  maps._map.data.addGeoJson(maps._allAreas);

}

maps.displayAreasByProperty = function(propertyValue) {
  maps._map.data.forEach(function (f) {
    var matches = false;
    for (var key in propertyValue) {
      if (propertyValue.hasOwnProperty(key)) {
        propertyValue[key].forEach(function (value) {
          if (matches || utf8fy(f.getProperty(key)) === value) {
            matches = true;
          }
        });
      }
    }
    if (!matches) maps._map.data.remove(f);
  });
}

/**
 * Groups areas on the map by a property
 * @param property
 */
maps.groupAreasByProperty = function(property) {
  var legend = document.getElementById('legend');



  maps._map.data.setStyle(function (feature) {
    var propContent = utf8fy(feature.getProperty(property));
    if (!(propContent in maps._usedColors) && propContent != 'undefined') {
      var col = maps._colors.shift();
      var container = document.createElement('div');
      var block = document.createElement('div');
      block.style.color = col;
      block.innerHTML = "&block;" + "&block;" + "&block;";
      block.style.display = "inline-block";
      block.style.margin = '3px';
      var text = document.createElement('div');
      text.innerHTML = propContent;
      text.style.display = "inline-block";
      container.appendChild(block);
      container.appendChild(text);
      legend.appendChild(container);
      maps._usedColors[propContent] = col;
    }
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
 * Fits every area on the map onto the screen.
 */
maps.fitAreasOnScreen = function() {
  var bounds = new google.maps.LatLngBounds();
  maps._map.data.addListener('addfeature', function(e) {
      maps.processPoints(e.feature.getGeometry(), bounds.extend, bounds);
      maps._map.fitBounds(bounds);
  });
}

maps.editArea = function(event, buttonId, infowindow, properties) {
  var button = document.getElementById(buttonId);
  var content = "";

  button.addEventListener("click", function() {
    maps._editInPrgrs = true;

    properties.forEach(function(property){
      if ((value = event.getProperty(property.name)) != undefined) {
        content += "<b> "+ property.displayName + ":</b> " + utf8fy(value) + "<br/>";
      }
    });

    maps._map.data.overrideStyle(event, {editable: true});
    infowindow.setContent(
        content +
      "<p>" + "<button id='editAreaDone'>" + "DONE" + " </button>" + "</p>"
    );

    var buttonDone = document.getElementById("editAreaDone");
    buttonDone.addEventListener("click", function() {
      maps._map.data.overrideStyle(event, {editable: false});
      maps.savePolygon();
      infowindow.close();
      maps._editInPrgrs = false;
    });

    infowindow.addListener("closeclick", function () {
      maps._map.data.overrideStyle(event, {editable: false});
      maps.loadDataFromLocalStorage();
      infowindow.close();
      maps._editInPrgrs = false;
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
 * Generates center coordinates for a polygon
 * @param geometry
 */
maps.getCentroid = function (geometry){
  var f;
  var x = 0;
  var y = 0;
  var nPts = geometry.length;
  var j = nPts-1;
  var area = 0;

  for (var i = 0; i < nPts; j=i++) {
    var pt1 = geometry[i];
    var pt2 = geometry[j];
    f = pt1.lat() * pt2.lng() - pt2.lat() * pt1.lng();
    x += (pt1.lat() + pt2.lat()) * f;
    y += (pt1.lng() + pt2.lng()) * f;

    area += pt1.lat() * pt2.lng();
    area -= pt1.lng() * pt2.lat();
  }
  area /= 2;
  f = area * 6;
  return new google.maps.LatLng(x/f, y/f);
}

/**
 * Generates a tooltip when clicking on an area
 * @param toolTipOnHover
 * @param properties: An array of objects with name(property name) and displayName(String to display)
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
      if (!maps._editInPrgrs) {
        var paths = [];
        event.feature.getGeometry().forEachLatLng(function (e) {
          paths.push(e)
        });
        var polyCenter = maps.getCentroid(paths);
        content = "";

        properties.forEach(function(property){
          if ((value = event.feature.getProperty(property.name)) != undefined) {
            content += "<b> "+ property.displayName + ":</b> " + utf8fy(value) + "<br/>";
          }
        });

        if (editable) {
          content += "<p>" + "<button id='editArea'>" + "CLICK ME TO EDIT FIELD" + " </button>" + "</p>";
        }

        infowindow.close();
        infowindow.setContent(
          content
        );

        infowindow.setPosition(polyCenter);
        infowindow.open(maps._map, this);

        if (editable) {
          maps.editArea(event.feature, 'editArea', infowindow, properties);
        }
      }
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
    return string;
}


// Just a random v11



