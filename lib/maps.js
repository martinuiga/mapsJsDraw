var maps = {}
maps._apiKey = "AIzaSyB7zuj9eaZkKbg7r0hWr_5Hbk70HPQeCLA";
maps._propertyToGroupBy = '';
maps._selectedAreas = [];
maps._usedColors = {};
maps._allAreas = {};
maps._displayedAreas = {};
maps._editInPrgrs = false;
maps._legendDivId = "";
maps._cb = false;
maps._legendObj = {};
maps._colors_cb = [
  '#d73027', //cb
  '#313695',  //cb
  '#e0f3f8', //cb
  '#8c510a', //cb
  '#35978f', //cb
  '#dfc27d', //cb
  '#f46d43', //cb
  '#543005', //cb
  '#4575b4', //cb
  '#a50026', //cb
  '#fdae61', //cb
  '#c7eae5', //cb
  '#01665e', //cb
  '#fee090', //cb
  '#f5f5f5', //cb
  '#80cdc1', //cb
  '#f6e8c3', //cb
  '#abd9e9', //cb
  '#74add1', //cb
  '#bf812d', //cb
  '#ffffbf', //cb
  '#003c30', //cb
]
maps._colors_cb_display = [
  '#a50026', //cb
  '#d73027', //cb
  '#f46d43', //cb
  '#fdae61', //cb
  '#fee090', //cb
  '#ffffbf', //cb
  '#e0f3f8', //cb
  '#abd9e9', //cb
  '#74add1', //cb
  '#4575b4', //cb
  '#313695',  //cb
  '#543005', //cb
  '#8c510a', //cb
  '#bf812d', //cb
  '#dfc27d', //cb
  '#f6e8c3', //cb
  '#f5f5f5', //cb
  '#c7eae5', //cb
  '#80cdc1', //cb
  '#35978f', //cb
  '#01665e', //cb
  '#003c30' //cb
]
maps._colors = [
  '#FE3F34',
  '#2196F3',
  '#009688',
  '#79AF3A',
  '#CDDC39',
  '#FFC107',
  '#FF5722',
  '#81C2FF',
  '#FF8F88',
  '#85F75D',
  '#DFDFDF',
  '#B79557',
  '#9C0800',
  '#FF94EC',
  '#A6FFF3',
  '#FFFAA6',
  '#893189'

  //'#795548',
  //'#607D8B',
  //'#F44336',
  //'#9C27B0',
  //'#673AB7',
  //'#3F51B5',
  //'#03A9F4',
  //'#00BCD4',
  //'#FF0000',
  //'#FF9800',
  //'#FFEB3B',
  //'#4CAF50',
  // '#0000FF',
  // '#FFA500',
  // '#008000',
  // '#FFFF00',
  // '#008080',
  // '#808080',
  // '#000080',
  // '#800000',
  // '#00FFFF',
  // '#FF00FF',
  // '#808000',
  // '#800080',
  // '#00FF00',
  // '#C0C0C0',
  // '#000000',
  // '#FFFFFF'
];
maps._colors_display = [
  '#FE3F34',
  '#2196F3',
  '#009688',
  '#79AF3A',
  '#CDDC39',
  '#FFC107',
  '#FF5722',
  '#81C2FF',
  '#FF8F88',
  '#85F75D',
  '#DFDFDF',
  '#B79557',
  '#9C0800',
  '#FF94EC',
  '#A6FFF3',
  '#FFFAA6',
  '#893189'

  //'#795548',
  //'#607D8B',
  //'#F44336',
  //'#9C27B0',
  //'#673AB7',
  //'#3F51B5',
  //'#03A9F4',
  //'#00BCD4',
  //'#FF0000',
  //'#FF9800',
  //'#FFEB3B',
  //'#4CAF50',
  // '#0000FF',
  // '#FFA500',
  // '#008000',
  // '#FFFF00',
  // '#008080',
  // '#808080',
  // '#000080',
  // '#800000',
  // '#00FFFF',
  // '#FF00FF',
  // '#808000',
  // '#800080',
  // '#00FF00',
  // '#C0C0C0',
  // '#000000',
  // '#FFFFFF'
];

// maps.build = function(apiKey) {
//   maps.apiKey = "AIzaSyB7zuj9eaZkKbg7r0hWr_5Hbk70HPQeCLA";
//   var script = document.createElement('script');
//   script.src = "https://maps.googleapis.com/maps/api/js?key=" + maps.apiKey + "&libraries=geometry&callback=maps.initialize";
//   document.getElementsByTagName('head')[0].appendChild(script);
// }

/**
 * Creates a blank legend area where legend content will be later added
 * @param toggableButtonText - Label for colorblind toggle button
 */
maps.buildLegend = function (toggableButtonText) {
  var colToggable = true;
  toggableButtonText = toggableButtonText || "Vaheta värve";

  var legendDiv = document.createElement('div');
  legendDiv.id = 'legend' + maps._randomString(10);
  maps._legendDivId = legendDiv.id;
  legendDiv.style.background = 'white';
  legendDiv.style.padding = '5px';
  legendDiv.style.margin = '10px';

  if(colToggable) {
    var button = document.createElement('div');
    button.innerHTML = "<p>" + "<button id='colortoggableID'>" + toggableButtonText +  "</button>" + "</p>";
    legendDiv.appendChild(button);
  }

  document.body.appendChild(legendDiv);
  maps._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById(maps._legendDivId));

  if(colToggable) maps.toggleColorblind('colortoggableID');
}

/**
 * Creates the area, where info about an area is displayed when hover-mode is active
 * @param propContent - Content that will be displayed
 */
maps.buildInfoWindow = function (propContent) {
  var infoWindowDiv = document.createElement('div');
  var container = document.createElement('div');
  container.innerHTML = propContent;
  infoWindowDiv.id = 'infoWindow';
  infoWindowDiv.style.background = 'white';
  infoWindowDiv.style.padding = '10px';
  infoWindowDiv.style.margin = '5px';
  infoWindowDiv.appendChild(container);
  document.body.appendChild(infoWindowDiv);
  maps._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
  maps._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('infoWindow'));
  maps._map.addListener('mousemove', function (event) {
    if (event.feature == undefined) maps._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
  })
}

/**
 * Function that needs to be the callback when including Google Maps in an HTML file
 */
maps.initialize = function() {
  maps._map = maps.createMap('map', 'hybrid');
  maps.fitAreasOnScreen();
}

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
    mapTypeControl: true,
    center: new google.maps.LatLng(59.436962, 24.753574),
    zoom: 7
  });
}

/**
 * Loads areas from localStorage and inserts them onto the map
 */
maps.loadDataFromLocalStorage = function() {
  var data = JSON.parse(localStorage.getItem('geoData'));
  maps._map.data.forEach(function (f) {
      maps._map.data.remove(f);
  });
  maps._propertyToGroupBy = localStorage.getItem('propertyToGroupBy');
  maps.importGeoJson(data, maps._propertyToGroupBy);
}

/**
 * Saves areas on the map to localStorage
 * TODO should receive callback to call for saving
 */
maps.saveDataToLocalStorage = function() {
  maps._map.data.toGeoJson(function (json) {
    localStorage.setItem('geoData', JSON.stringify(json));
  });
  localStorage.setItem('propertyToGroupBy', maps._propertyToGroupBy);
}

/**
 * Saves areas to _allAreas variable
 */
maps.saveData = function () {
  maps._map.data.toGeoJson(function (json) {
    maps._allAreas = json;
  });
}

/**
 * Loads areas from the _allAreas variable and inserts them onto the map
 */
maps.loadData = function () {
  maps._map.data.forEach(function (f) {
    maps._map.data.remove(f);
  });
  maps.importGeoJson(maps._allAreas, maps._propertyToGroupBy);
}

/**
 * Creates a new area on the map
 */
maps.createNewArea = function() {
  maps._map.data.setDrawingMode('Polygon');
  maps._map.data.addListener('addfeature', function () {
    maps._map.data.setDrawingMode(null);
    maps.saveData();
  });
}

/**
 * Updates the geometry of a current area with given id with the geometry of the given feature
 * @param id - Value of the area's "id" property
 * @param feature - Feature with the new geometry. The new geometry will be taken from this feature
 */
maps.updateGeometry = function(id, feature) {
  var replaced = false;
  maps._map.data.forEach(function (featureCurrent) {
    if (featureCurrent.getProperty("id") == id) {
      var newLinRingArr = [];
      feature.geometry.coordinates[0].forEach(function (linearRing) {
        var newLatLngArr = [];
        linearRing.forEach(function (latLng) {
          var newLatLng = new google.maps.LatLng(latLng[1], latLng[0]);
          newLatLngArr.push(newLatLng);
        });
        var newLinRing = new google.maps.Data.LinearRing(newLatLngArr);
        newLinRingArr.push(newLinRing);
      });
      var newMultiPoly = new google.maps.Data.MultiPolygon([new google.maps.Data.Polygon(newLinRingArr)]);
      featureCurrent.setGeometry(newMultiPoly);
      replaced = true;
    }
  });

  if (!replaced) {
    maps._map.data.addGeoJson({
      'type': 'FeatureCollection',
      'features' : [feature]
    });
  }
}

/**
 * Imports the GeoJSON data to map
 * @param json - GeoJSON data
 * @param prop - Property to group areas by. Optional.
 */
maps.importGeoJson = function(json, prop) {
  if (Object.keys(maps._allAreas).length !== 0) {
    json.features.forEach(function(feature) {
      propertyId = feature.properties.id;
      maps.updateGeometry(propertyId, feature);
    })
  } else {
    maps._map.data.addGeoJson(json);
  }

  maps.saveData();
  maps._propertyToGroupBy = prop;
  maps.groupAreasByProperty(maps._propertyToGroupBy);
}

/**
 * Deletes an area from the map. Needs id of the area. "selected" needs to be true for deleting. (?)
 * @param id - Id of the area
 * @param selected
 */
maps.deleteAreas = function (id, selected) {
  maps._map.data.forEach(function (e) {
    if ((e.getProperty('id') == id) && selected) maps._map.data.remove(e);
  });
  maps._allAreas.features.forEach(function (e) {
    if ((e.properties['id'] == id) && selected) maps._allAreas.features.splice(e,1);
  });
}

/**
 * Edits an area's property.
 * @param id - Id of the area
 * @param prop - Name of the property to be edited
 * @param value - New value of the given property
 */
maps.editProperties = function (id, prop, value) {
  maps._map.data.forEach(function (e) {
    if (e.getProperty('id') == id) e.setProperty(prop, value);
  });
  maps._allAreas.features.forEach(function (e) {
    if (e.properties['id'] == id) e.properties[prop] = value;
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

/**
 * Listens for clicks on area and returns the given property of the featuree
 * @param callback that gets called with feature
 * @param property that gets returned on the feature
 */
maps.listenForAreaClicks = function (callback, property) {
  maps._map.data.addListener("click", function (event) {
    feature = event.feature;
    callback(feature.getProperty(property));
  })
}

/**
 * Changes the color of an area on the map
 * @param id - Id of the area
 * @param color - New color
 */
maps.colorArea = function (id, color) {
  maps._map.data.forEach(function(feature) {
    propertyId = feature.getProperty("id");
    if (propertyId == id) {
      maps._map.data.overrideStyle(feature, {fillColor: color, strokeColor: color});
    }
  })
}


maps._selectArea = function(id, feature) {
  maps._selectedAreas.push(id);
  if (maps._propertyToGroupBy == undefined) {
    maps._map.data.overrideStyle(feature, {fillColor: '#00cc00', strokeColor: '#00cc00'});
  } else {
    maps._map.data.overrideStyle(feature, {fillOpacity: 0.9});
  }
}

maps._deselectArea = function(id, feature) {
  index = maps._selectedAreas.indexOf(id);
  maps._selectedAreas.splice(index, 1);
  if (maps._propertyToGroupBy == undefined) {
    maps._map.data.overrideStyle(feature, {fillColor: maps._usedColors[undefined], strokeColor: maps._usedColors[undefined]});
  } else {
    maps._map.data.overrideStyle(feature, {fillOpacity: 0.3});
  }
}

/**
 * Selects every area on the map
 */
maps.selectAllAreas = function() {
  maps._map.data.forEach(function(feature) {
    maps._selectArea(feature.getProperty("id"), feature)
  })
}

/**
 * Clears the current selection
 */
maps.clearSelectedAreas = function () {
  maps._map.data.forEach(function(feature) {
    maps._deselectArea(feature.getProperty("id"), feature)
  })
}

/**
 * Add an area to the selection
 * @param id - Id of the area to be selected
 */
maps.selectArea = function(id) {
  maps._map.data.forEach(function(feature) {
    propertyId = feature.getProperty("id");
    if (propertyId == id) {
      maps._selectArea(id, feature);
    }
  })
}

/**
 * Removes area from the selection
 * @param id - Id of the area to be deselected
 */
maps.deselectArea = function(id) {
  maps._map.data.forEach(function(feature) {
    propertyId = feature.getProperty("id");
    if (propertyId == id) {
      maps._deselectArea(id, feature);
    }
  })
}

/**
 * Returns the current selection
 * @returns {Array}
 */
maps.getSelectedAreas = function () {
  return maps._selectedAreas;
}

/**
 * Makes every area on the map visible
 */
maps.displayAllAreas = function () {
  maps._map.data.forEach(function (f) {
    maps._map.data.remove(f);
  });
  //maps.loadDataFromLocalStorage();
  maps._map.data.addGeoJson(maps._allAreas);

}

/**
 * Makes areas with the given property or properties visible on the map
 * @param propertyValue - Object, with property names as keys and list of property values as values
 */
maps.displayAreasByProperty = function(propertyValue) {
  maps._map.data.forEach(function (f) {
    var i = Object.keys(propertyValue).length;
    for (var key in propertyValue) {
      if (propertyValue.hasOwnProperty(key)) {
        propertyValue[key].forEach(function (value) {
          if (f.getProperty(key) === value) {
            i--;
          }
        });
      }
    }
    if (i != 0) maps._map.data.remove(f);
  });
}

maps._appendLegendContent = function (col, propContent, legendObj) {
  legendObj[col] = propContent;
  return legendObj;
}

/**
 * Adds legend content to the legend.
 * @param legendObj - Object where key is color and value is data that corresponds to the color
 */
maps.generateLegendContent = function (legendObj) {
  if (maps._cb) {
    var colObj = maps._colors_cb_display;
  } else {
    colObj = maps._colors_display;
  }

  colObj.forEach(function (color) {
    var legend = document.getElementById(maps._legendDivId);
    var container = document.createElement('div');
    var block = document.createElement('div');
    block.style.color = color;
    block.innerHTML = "&block;" + "&block;" + "&block;";
    block.style.display = "inline-block";
    block.style.margin = '3px';
    var text = document.createElement('div');
    if (legendObj.hasOwnProperty(color)) {
      text.innerHTML = legendObj[color];
      text.style.display = "inline-block";
      container.appendChild(block);
      container.appendChild(text);
    }
    legend.appendChild(container);
  })
}

maps._regenerateColors = function () {
  maps._colors_cb = [
    '#d73027', //cb
    '#313695',  //cb
    '#e0f3f8', //cb
    '#8c510a', //cb
    '#35978f', //cb
    '#dfc27d', //cb
    '#f46d43', //cb
    '#543005', //cb
    '#4575b4', //cb
    '#a50026', //cb
    '#fdae61', //cb
    '#c7eae5', //cb
    '#01665e', //cb
    '#fee090', //cb
    '#f5f5f5', //cb
    '#80cdc1', //cb
    '#f6e8c3', //cb
    '#abd9e9', //cb
    '#74add1', //cb
    '#bf812d', //cb
    '#ffffbf', //cb
    '#003c30', //cb
  ]
  maps._colors = [
    '#FE3F34', '#2196F3', '#009688', '#79AF3A', '#CDDC39', '#FFC107', '#FF5722', '#81C2FF', '#FF8F88', '#85F75D', '#DFDFDF',
    '#B79557', '#9C0800', '#FF94EC', '#A6FFF3', '#FFFAA6', '#893189'];
}

/**
 * Toggles between normal and colorblind colors when the button with the given id is uesd
 * @param buttonId - Id of the "toggle colorblind" button
 */
maps.toggleColorblind = function (buttonId) {
  var button = document.getElementById(buttonId);

  button.addEventListener("click", function() {
    maps._cb = !maps._cb;
    maps._regenerateColors();
    maps._usedColors = {};
    maps._map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
    maps.buildLegend();
    maps.loadData();
  });
}

/**
 * Groups areas on the map by a property
 * @param property
 */
maps.groupAreasByProperty = function(property) {
  var legendObj = {};
  if (property != undefined && property != '' && !!document.getElementById(maps._legendDivId) == false) {
    maps.buildLegend();
  }

  maps._map.data.forEach(function (feature) {
    var propContent = feature.getProperty(property);
    if (!(propContent in maps._usedColors) && propContent != 'undefined') {
      var col;
      if (maps._cb) {
        col = maps._colors_cb.shift();
      } else {
        col = maps._colors.shift();
      }
      if (property != undefined && property != '') maps._appendLegendContent(col, propContent, legendObj);
      maps._usedColors[propContent] = col;
    }
  });

  maps._map.data.setStyle(function (feature) {
    var propContent = feature.getProperty(property);
    if (maps._cb) {
      var fnr = 0.9;
    } else {
      fnr = 0.3;
    }
    return {
      fillOpacity: fnr,
      fillColor: maps._usedColors[propContent],
      strokeColor: maps._usedColors[propContent],
      strokeWeight: 2
    }
  });
  if (property != undefined && property != '') maps.generateLegendContent(legendObj);
}

/**
 * Processes area coordinates that are on the map
 * @param geometry
 * @param callback
 * @param thisArg
 */
maps._processPoints = function(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach(function(g) {
      maps._processPoints(g, callback, thisArg);
    });
  }
}

/**
 * Fits every area on the map onto the screen.
 */
maps.fitAreasOnScreen = function() {
  var bounds = new google.maps.LatLngBounds();
  maps._map.data.addListener('addfeature', function(e) {
    maps._processPoints(e.feature.getGeometry(), bounds.extend, bounds);
    maps._map.fitBounds(bounds);
  });
}

/**
 * Zoom into a area with given id
 * @param areaID - list with area ID's
 */
maps.zoomIntoArea = function (areaID) {
  var bounds = new google.maps.LatLngBounds();

  maps._map.data.forEach(function(feature) {
    propertyId = feature.getProperty("id");
    if (areaID.includes(propertyId)) {
      maps._processPoints(feature.getGeometry(), bounds.extend, bounds);
      maps._map.fitBounds(bounds);
    }
  });
}


maps._EditAreaBtn = function (controlDiv, event, type, btnTxt) {
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginTop = '10px';
  controlUI.style.marginBottom = '11px';
  controlUI.style.marginRight = '3px';
  controlUI.style.textAlign = 'center';
  controlUI.style.display = "inline-block";
  controlDiv.appendChild(controlUI);

  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '11px';
  controlText.style.lineHeight = '24px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = btnTxt;
  controlUI.appendChild(controlText);

  controlUI.addEventListener('click', function() {
    maps._map.data.overrideStyle(event, {editable: false});
    if (type == 'done') maps.saveData();
    if (type == 'cancel') maps.loadData();
    maps._editInPrgrs = false;
    maps._map.controls[google.maps.ControlPosition.TOP_CENTER].clear();
  });
}

/**
 * Toggles area editing.
 * @param feature - Feature that will be edited
 * @param buttonId - Id of the button that will toggle the editing
 * @param infowindow - infoWindow where that button is located
 * @param editDoneTxt - Label for the button that saves the editing
 * @param editCancelTxt - Label for the button that cancels the editing
 */
maps.editArea = function(feature, buttonId, infowindow, editDoneTxt, editCancelTxt) {
  var button = document.getElementById(buttonId);

  button.addEventListener("click", function() {
    maps._editInPrgrs = true;
    infowindow.close();
    var centerControlDiv = document.createElement('div');
    centerControlDiv.style.display = "inline-block";
    var doneBtn = new maps._EditAreaBtn(centerControlDiv, feature, 'done', editDoneTxt);
    var cancelBtn = new maps._EditAreaBtn(centerControlDiv, feature, 'cancel', editCancelTxt);

    centerControlDiv.index = 1;
    maps._map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
    maps._map.data.overrideStyle(feature, {editable: true});
  });
}

/**
 * Enables showing tooltips when clicking on an area
 * @param options: array which contains options for the tooltip (hover : boolean, propertiesToDisplay : object,
 * editable : boolean, editBtnTxt : string, editDoneTxt : string, editCancelTxt : string)
 */

maps.setupInfoWindow = function (options) {
  var hover = false;
  var propertiesToDisplay = [];
  var editable = false;
  var editBtnTxt = "Edit area";
  var editDoneTxt = "Done";
  var editCancelTxt = "Cancel";

  if ('hover' in options && (options['hover'] == true || options['hover'] == false)) {
    hover = options['hover'];
  }
  if ('properties' in options && options['properties'] != undefined) {
    propertiesToDisplay = options['properties'];
  }
  if ('editable' in options && (options['editable'] == true || options['editable'] == false)) {
    editable = options['editable'];
  }
  if ('editBtnTxt' in options) {
    editBtnTxt = options['editBtnTxt'];
  }
  if ('editDoneTxt' in options) {
    editDoneTxt = options['editDoneTxt'];
  }
  if ('editCancelTxt' in options) {
    editCancelTxt = options['editCancelTxt'];
  }
  maps.getInfoWindowforArea(hover, propertiesToDisplay, editable, editBtnTxt, editDoneTxt, editCancelTxt);
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
 * Generates a tooltip for an area
 * @param toolTipOnHover - boolean, whether or not tooltip appears with hovering
 * @param properties - An array of objects with name(property name) and displayName(String to display)
 * @param editable - boolean, whether or not the area can be edited
 * @param editBtnTxt - Label for the area editing button
 * @param editDoneTxt - Label for finishing the area editing
 * @param editCancelTxt - Label for cancelling the area editing
 */
maps.getInfoWindowforArea = function(toolTipOnHover, properties, editable, editBtnTxt, editDoneTxt, editCancelTxt) {
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
          content += "<b> "+ property.displayName + ":</b> " + value + "<br/>";
        }
      });

      if(toolTipOnHover) {
        maps.buildInfoWindow(content);
      }
      else {
        if (editable) {
          content += "<p>" + "<button id='editArea'>" + editBtnTxt + " </button>" + "</p>";
        }

        infowindow.close();
        infowindow.setContent(
          content
        );

        infowindow.setPosition(polyCenter);
        infowindow.open(maps._map, this);

        if (editable) {
          maps.editArea(event.feature, 'editArea', infowindow, editDoneTxt, editCancelTxt);
        }
      }
    }
  });

  if(!(toolTipOnHover)) {
    infowindow.addListener("closeclick", function () {
      content = "";
      infowindow.close();
    });
  }
}

/**
 * Returns Google Static Maps picture url for the input feature. Size parameter default value is "400x400". Format
 * default value is "png"
 * @param {Feature} feature
 * @param {String} size
 * @param {String} format
 * @return {String} url
 */
maps.getScreenshot = function (feature, size, format) {
  size = size || "400x400";
  format = format || "png";
  var paths = "color:0x" + maps._usedColors[feature.getProperty(maps._propertyToGroupBy)].replace("#", "") +
    "|fillcolor:0x" + maps._usedColors[feature.getProperty(maps._propertyToGroupBy)].replace("#", "") + "|weight:2|enc:";
  var latlngs = [];

  feature.getGeometry().getArray()[0]["b"][0].forEachLatLng(function (e) {
    latlngs.push(new google.maps.LatLng(parseFloat(e.lat()), parseFloat(e.lng())));
  });
  paths += google.maps.geometry.encoding.encodePath(latlngs);

  return "https://maps.googleapis.com/maps/api/staticmap?format="+format+"&size="+size+"&path="+paths+"&key="+maps._apiKey;
}

maps._randomString = function (length_) {

  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
  if (typeof length_ !== "number") {
    length_ = Math.floor(Math.random() * chars.length_);
  }
  var str = '';
  for (var i = 0; i < length_; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
