var maps = {};
maps.mapsList = [];

maps.initMaps = function () {
  maps.mapsList.forEach(function (map) {
    map.initialize();
  })
};

maps.Maps = function (apiKey, mapDivId) {
  //this._apiKey = apiKey;

  // var script = document.createElement('script');
  // script.src = "https://maps.googleapis.com/maps/api/js?key=" + apiKey + "&libraries=geometry&callback=maps.initialize";
  // document.getElementsByTagName('head')[0].appendChild(script);
  maps.mapsList.push(this);
  this._propertyToGroupBy = '';
  this._selectedAreas = [];
  this._usedColors = {};
  this._allAreas = {};
  this._displayedAreas = {};
  this._editInPrgrs = false;
  this._legendDivId = "";
  this._cb = false;
  this._btnNameCasualColors = "Värvipimedatele";
  this._btnNameCBColors = "Tavavärvid";
  this._legendObj = {};
  this._colors_cb = [
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
  ];
  this._colors_cb_display = [
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
  ];
  this._colors = [
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
  this._colors_display = [
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
  this.mapDivId = mapDivId;
  this.legendCallback = function () {
  };
  //this._map = "";

  /**
   * Creates a blank legend area where legend content will be later added
   * @param toggableButtonText - Label for colorblind toggle button
   */
  this.buildLegend = function (toggableButtonText) {
    var colToggable = true;
    toggableButtonText = toggableButtonText || "Vaheta värve";
    var colorToggleId = "colortoggableID" + this._randomString(5);

    var legendDiv = document.createElement('div');
    legendDiv.id = 'legend' + this._randomString(10);
    this._legendDivId = legendDiv.id;
    legendDiv.style.background = 'white';
    legendDiv.style.padding = '5px';
    legendDiv.style.margin = '10px';
    legendDiv.style.fontFamily = 'Montserrat';

    if (colToggable) {
      var button = document.createElement('div');
      button.innerHTML = '<button id="' + colorToggleId + '" class="btn btn-success btn-square btn-block">' + toggableButtonText + '</button>';
      legendDiv.appendChild(button);
    }

    document.body.appendChild(legendDiv);
    this._map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById(this._legendDivId));

    if (colToggable) this.toggleColorblind(colorToggleId);
  };

  /**
   * Creates the area, where info about an area is displayed when hover-mode is active
   * @param propContent - Content that will be displayed
   */
  this.buildInfoWindow = function (propContent) {
    var mapThis = this;
    var infoWindowDiv = document.createElement('div');
    var container = document.createElement('div');
    container.innerHTML = propContent;
    infoWindowDiv.id = 'infoWindow';
    infoWindowDiv.style.background = 'white';
    infoWindowDiv.style.padding = '10px';
    infoWindowDiv.style.margin = '5px';
    infoWindowDiv.appendChild(container);
    this._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
    this._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(infoWindowDiv);
    this._map.addListener('mousemove', function (event) {
      if (event.feature == undefined) mapThis._map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
    })
  };

  /**
   * Function that needs to be the callback when including Google Maps in an HTML file
   */
  this.initialize = function () {
    this._map = this.createMap(this.mapDivId, 'hybrid');
    this.fitAreasOnScreen();
    google.maps.event.addListener(this._map, 'click', function(){
      this.setOptions({scrollwheel:true});
    });
    google.maps.event.addListener(this._map, 'drag', function(){
      this.setOptions({scrollwheel:true});
    });
  };

  /**
   * Creates a new Google Map. Needs id of the HTML div where the map is going to be and also the map type (terrain,
   * satellite, hybrid)
   * @param idOfDiv
   * @param mapType
   * @return {google.maps.Map}
   */
  this.createMap = function (idOfDiv, mapType) {
    return new google.maps.Map(document.getElementById(idOfDiv), {
      mapTypeId: mapType,
      mapTypeControl: true,
      center: new google.maps.LatLng(59.436962, 24.753574),
      zoom: 7,
      scrollwheel: false
      //styles: [{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#ffd9d9"}]},{"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#cccccc"},{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"transit.station.airport","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#FFFFFF"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]}]
    });
  };

  /**
   * Loads areas from localStorage and inserts them onto the map
   */
  this.loadDataFromLocalStorage = function () {
    var mapThis = this;
    var data = JSON.parse(localStorage.getItem('geoData'));
    this._map.data.forEach(function (f) {
      mapThis._map.data.remove(f);
    });
    this._propertyToGroupBy = localStorage.getItem('propertyToGroupBy');
    this.importGeoJson(data, this._propertyToGroupBy);
  };

  /**
   * Saves areas on the map to localStorage
   * TODO should receive callback to call for saving
   */
  this.saveDataToLocalStorage = function () {
    this._map.data.toGeoJson(function (json) {
      localStorage.setItem('geoData', JSON.stringify(json));
    });
    localStorage.setItem('propertyToGroupBy', this._propertyToGroupBy);
  };

  /**
   * Saves areas to _allAreas variable
   */
  this.saveData = function () {
    var mapThis = this;
    this._map.data.toGeoJson(function (json) {
      mapThis._allAreas = json;
    });
  };

  /**
   * Loads areas from the _allAreas variable and inserts them onto the map
   */
  this.loadData = function () {
    var mapThis = this;
    this._map.data.forEach(function (f) {
      mapThis._map.data.remove(f);
    });
    this.importGeoJson(this._allAreas, this._propertyToGroupBy);
  };

  /**
   * Creates a new area on the map
   */
  this.createNewArea = function () {
    var mapThis = this;
    this._map.data.setDrawingMode('Polygon');
    this._map.data.addListener('addfeature', function () {
      mapThis._map.data.setDrawingMode(null);
      mapThis.saveData();
    });
  };

  /**
   * Updates the geometry of a current area with given id with the geometry of the given feature
   * @param id - Value of the area's "id" property
   * @param feature - Feature with the new geometry. The new geometry will be taken from this feature
   */
  this.updateGeometry = function (id, feature) {
    var replaced = false;
    this._map.data.forEach(function (featureCurrent) {
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
      this._map.data.addGeoJson({
        'type': 'FeatureCollection',
        'features': [feature]
      });
    }
  };

  /**
   * Imports the GeoJSON data to map
   * @param json - GeoJSON data
   * @param prop - Property to group areas by. Optional.
   */
  this.importGeoJson = function (json, prop) {
    var mapThis = this;
    if (Object.keys(this._allAreas).length !== 0) {
      json.features.forEach(function (feature) {
        var propertyId = feature.properties.id;
        mapThis.updateGeometry(propertyId, feature);
      })
    } else {
      this._map.data.addGeoJson(json);
    }
    this.saveData();
    this._propertyToGroupBy = prop;
    this.groupAreasByProperty(this._propertyToGroupBy);
  };
  /**
   * Adds a marker to the map
   * @param lat latitude of the marker
   * @param lng longitude of the marker
   * @param info Object containing info about marker. Gets displayed in an infowindow when hovering. E.g {"Height" : "255m"}
   * @param inAreaIcon optional parameter for custom icon when marker is inside an area
   * @param outAreaIcon optional parameter for custom icon when marker is outside an area
   */
  this.addMarker = function (lat, lng, info, inAreaIcon, outAreaIcon) {
    var mapThis = this;
    var icon = outAreaIcon;
    var position = new google.maps.LatLng(lat, lng);
    mapThis._map.data.forEach(function (feature) {
      var polypath = [];
      feature.getGeometry().forEachLatLng(function (e) {polypath.push(e)});
      if (google.maps.geometry.poly.containsLocation(position, new google.maps.Polygon({paths: polypath}))) icon = inAreaIcon;
    });
    var marker = new google.maps.Marker({
      map: mapThis._map,
      position: position,
      clickable: true,
      icon: icon
    });

    marker.addListener('mouseover', function () {
      mapThis._getInfoWindowforMarker(info);
    });
  };

  this._getInfoWindowforMarker = function (infoToDisplay) {
    var mapThis = this;
    var content;
    var infowindow = new google.maps.InfoWindow({});

    if (!mapThis._editInPrgrs) {
      content = "";
      for (var key in infoToDisplay) {
        if (infoToDisplay.hasOwnProperty(key)) {
          content += "<b> " + key + ":</b> " + infoToDisplay[key] + "<br/>";
        }
        mapThis.buildInfoWindow(content);
      }
    }
  };

  /**
   * Deletes an area from the map. Needs id of the area. "selected" needs to be true for deleting. (?)
   * @param id - Id of the area
   * @param selected
   * @param parent
   */
  this.deleteAreas = function (id, selected, parent) {
    var mapThis = parent;
    mapThis._map.data.forEach(function (e) {
      if ((e.getProperty('id') == id) && selected) mapThis._map.data.remove(e);
    });
    mapThis._allAreas.features.forEach(function (e) {
      if ((e.properties['id'] == id) && selected) mapThis._allAreas.features.splice(e, 1);
    });
  };

  /**
   * Edits an area's property.
   * @param id - Id of the area
   * @param prop - Name of the property to be edited
   * @param value - New value of the given property
   */
  this.editProperties = function (id, prop, value) {
    this._map.data.forEach(function (e) {
      if (e.getProperty('id') == id) e.setProperty(prop, value);
    });
    this._allAreas.features.forEach(function (e) {
      if (e.properties['id'] == id) e.properties[prop] = value;
    });
    this.groupAreasByProperty(this._propertyToGroupBy);
  };

  /**
   * Listens for area selections and passes the selected areas to the callback
   * @param callback
   */
  this.listenForAreaSelections = function (callback) {
    var mapThis = this;
    this._map.data.addListener("click", function (event) {
      var feature = event.feature;
      var id = feature.getProperty("id");
      var index = mapThis._selectedAreas.indexOf(id);
      var selected = true;
      if (index == -1) {
        mapThis._selectArea(id, feature);
      } else {
        mapThis._deselectArea(id, feature);
        selected = false
      }
      callback(id, selected, mapThis);
    })
  };

  /**
   * Changes style of the selected map, e.g https://snazzymaps.com/style/151/ultra-light-with-labels
   * @param file name of the JSON file with
   */
  this.changeStyle = function (file) {
    var mapThis = this;
    this.readJSONFile(file + ".json", function (text) {
      var data = JSON.parse(text);
      mapThis._map.setOptions({styles: data});
    });
  };


  this.readJSONFile = function (file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("maps-js-lib");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    };
    rawFile.send(null);
  };


  /**
   * Listens for clicks on area and returns the given property of the featuree
   * @param callback that gets called with feature
   * @param property that gets returned on the feature
   */
  this.listenForAreaClicks = function (callback, property) {
    this._map.data.addListener("click", function (event) {
      var feature = event.feature;
      callback(feature.getProperty(property));
    })
  };

  /**
   * Changes the color of an area on the map
   * @param id - Id of the area
   * @param color - New color
   */
  this.colorArea = function (id, color) {
    var mapThis = this;
    this._map.data.forEach(function (feature) {
      var propertyId = feature.getProperty("id");
      if (propertyId == id) {
        mapThis._map.data.overrideStyle(feature, {fillColor: color, strokeColor: color});
      }
    })
  };


  this._selectArea = function (id, feature) {
    this._selectedAreas.push(id);
    if (this._propertyToGroupBy == undefined) {
      this._map.data.overrideStyle(feature, {fillColor: '#00cc00', strokeColor: '#00cc00'});
    } else {
      this._map.data.overrideStyle(feature, {fillOpacity: 0.9});
    }
  };

  this._deselectArea = function (id, feature) {
    var index = this._selectedAreas.indexOf(id);
    this._selectedAreas.splice(index, 1);
    if (this._propertyToGroupBy == undefined) {
      this._map.data.overrideStyle(feature, {
        fillColor: this._usedColors[undefined],
        strokeColor: this._usedColors[undefined]
      });
    } else {
      this._map.data.overrideStyle(feature, {fillOpacity: 0.3});
    }
  };

  /**
   * Selects every area on the map
   */
  this.selectAllAreas = function () {
    var mapThis = this;
    this._map.data.forEach(function (feature) {
      mapThis._selectArea(feature.getProperty("id"), feature)
    })
  };

  /**
   * Clears the current selection
   */
  this.clearSelectedAreas = function () {
    var mapThis = this;
    this._map.data.forEach(function (feature) {
      mapThis._deselectArea(feature.getProperty("id"), feature)
    })
  };

  /**
   * Add an area to the selection
   * @param id - Id of the area to be selected
   */
  this.selectArea = function (id) {
    var mapThis = this;
    this._map.data.forEach(function (feature) {
      var propertyId = feature.getProperty("id");
      if (propertyId == id) {
        mapThis._selectArea(id, feature);
      }
    })
  };

  /**
   * Removes area from the selection
   * @param id - Id of the area to be deselected
   */
  this.deselectArea = function (id) {
    var mapThis = this;
    this._map.data.forEach(function (feature) {
      var propertyId = feature.getProperty("id");
      if (propertyId == id) {
        mapThis._deselectArea(id, feature);
      }
    })
  };

  /**
   * Returns the current selection
   * @returns {Array}
   */
  this.getSelectedAreas = function () {
    return this._selectedAreas;
  };

  /**
   * Makes every area on the map visible
   */
  this.displayAllAreas = function () {
    var mapThis = this;
    this._map.data.forEach(function (f) {
      mapThis._map.data.remove(f);
    });
    //this.loadDataFromLocalStorage();
    this._map.data.addGeoJson(this._allAreas);

  };

  /**
   * Makes areas with the given property or properties visible on the map
   * @param propertyValue - Object, with property names as keys and list of property values as values
   */
  this.displayAreasByProperty = function (propertyValue) {
    var mapThis = this;
    this._map.data.forEach(function (f) {
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
      if (i != 0) mapThis._map.data.remove(f);
    });
  };

  this._appendLegendContent = function (col, propContent, legendObj) {
    legendObj[col] = propContent;
    return legendObj;
  };

  this.emptyDiv = function (divId) {
    var elem = document.getElementById(divId);

    while (elem.lastChild && elem.childElementCount > 1) {
      elem.removeChild(elem.lastChild);
    }
  };

  /**
   * Adds legend content to the legend.
   * @param legendObj - Object where key is color and value is data that corresponds to the color
   */
  this.generateLegendContent = function (legendObj) {
    this._regenerateColors();
    this.emptyDiv(this._legendDivId);
    var mapThis = this;
    if (this._cb) {
      var colObj = this._colors_cb_display;
    } else {
      colObj = this._colors_display;
    }

    var legend = document.getElementById(mapThis._legendDivId);
    colObj.forEach(function (color) {
      if (legendObj.hasOwnProperty(color)) {
        var container = document.createElement('div');
        container.style.marginTop = '3px';
        var block = document.createElement('div');
        block.style.backgroundColor = color;
        block.style.width = '23px';
        block.style.height = '15px';
        block.style.display = 'inline-block';
        block.style.float = 'left';
        var text = document.createElement('div');
        text.innerHTML = legendObj[color];
        text.style.display = "inline-block";
        text.style.paddingLeft = '3px';
        container.appendChild(block);
        container.appendChild(text);
        container.addEventListener('click', function () {
          mapThis.legendCallback(mapThis._propertyToGroupBy, this.childNodes[1].childNodes[0].data);
        });

        legend.appendChild(container);
      }
    })
  };

  /**
   * Sets the callback for the legend onClick.
   * @param func
   */
  this.setLegendCallback = function (func) {
    this.legendCallback = func;
  };

  this._regenerateColors = function () {
    this._colors_cb = [
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
      '#003c30' //cb
    ];
    this._colors = [
      '#FE3F34', '#2196F3', '#009688', '#79AF3A', '#CDDC39', '#FFC107', '#FF5722', '#81C2FF', '#FF8F88', '#85F75D', '#DFDFDF',
      '#B79557', '#9C0800', '#FF94EC', '#A6FFF3', '#FFFAA6', '#893189'];
  };

  /**
   * Toggles between normal and colorblind colors when the button with the given id is used
   * @param buttonId - Id of the "toggle colorblind" button
   */
  this.toggleColorblind = function (buttonId) {
    var mapThis = this;
    var button = document.getElementById(buttonId);

    button.addEventListener("click", function () {
      mapThis._cb = !mapThis._cb;
      mapThis._regenerateColors();
      mapThis._usedColors = {};
      mapThis._map.controls[google.maps.ControlPosition.TOP_RIGHT].clear();
      if (mapThis._cb) {
        mapThis.buildLegend(mapThis._btnNameCBColors);
      } else {
        mapThis.buildLegend(mapThis._btnNameCasualColors);
      }
      mapThis.groupAreasByProperty(mapThis._propertyToGroupBy);
    });
  };

  /**
   * Groups areas on the map by a property
   * @param property
   */
  this.groupAreasByProperty = function (property) {
    var mapThis = this;
    var legendObj = {};
    this._usedColors = {};
    this._propertyToGroupBy = property;
    if (property != undefined && property != '' && !!document.getElementById(this._legendDivId) == false) {
      this.buildLegend(mapThis._btnNameCasualColors);
    }

    this._map.data.forEach(function (feature) {
      var propContent = feature.getProperty(property);
      if (!(propContent in mapThis._usedColors) && propContent != 'undefined') {
        var col;
        if (mapThis._cb) {
          col = mapThis._colors_cb.shift();
        } else {
          col = mapThis._colors.shift();
        }
        if (property != undefined && property != '') mapThis._appendLegendContent(col, propContent, legendObj);
        mapThis._usedColors[propContent] = col;
      }
    });

    this._map.data.setStyle(function (feature) {
      var propContent = feature.getProperty(property);
      var fnr;

      if (mapThis._cb) {
        fnr = 0.3;
      } else {
        fnr = 0.3;
      }
      return {
        fillOpacity: fnr,
        fillColor: mapThis._usedColors[propContent],
        strokeColor: mapThis._usedColors[propContent],
        strokeWeight: 1.5
      }
    });
    if (property != undefined && property != '') this.generateLegendContent(legendObj);
  };

  /**
   * Processes area coordinates that are on the map
   * @param geometry
   * @param callback
   * @param thisArg
   */
  this._processPoints = function (geometry, callback, thisArg) {
    var mapThis = this;
    if (geometry instanceof google.maps.LatLng) {
      callback.call(thisArg, geometry);
    } else if (geometry instanceof google.maps.Data.Point) {
      callback.call(thisArg, geometry.get());
    } else {
      geometry.getArray().forEach(function (g) {
        mapThis._processPoints(g, callback, thisArg);
      });
    }
  };

  /**
   * Fits every area on the map onto the screen.
   */
  this.fitAreasOnScreen = function () {
    var mapThis = this;
    var bounds = new google.maps.LatLngBounds();
    this._map.data.addListener('addfeature', function (e) {
      mapThis._processPoints(e.feature.getGeometry(), bounds.extend, bounds);
      mapThis._map.fitBounds(bounds);
    });
  };

  /**
   * Zoom into a area with given id
   * @param areaID - list with area ID's
   */
  this.zoomIntoArea = function (areaID) {
    var mapThis = this;
    var bounds = new google.maps.LatLngBounds();

    this._map.data.forEach(function (feature) {
      var propertyId = feature.getProperty("id");
      if (areaID.includes(propertyId)) {
        mapThis._processPoints(feature.getGeometry(), bounds.extend, bounds);
        mapThis._map.fitBounds(bounds);
      }
    });
  };


  this._EditAreaBtn = function (controlDiv, event, type, btnTxt, parent) {
    var mapThis = parent;
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

    controlUI.addEventListener('click', function () {
      mapThis._map.data.overrideStyle(event, {editable: false});
      if (type == 'done') mapThis.saveData();
      if (type == 'cancel') mapThis.loadData();
      mapThis._editInPrgrs = false;
      mapThis._map.controls[google.maps.ControlPosition.TOP_CENTER].clear();
    });
  };

  /**
   * Toggles area editing.
   * @param feature - Feature that will be edited
   * @param buttonId - Id of the button that will toggle the editing
   * @param infowindow - infoWindow where that button is located
   * @param editDoneTxt - Label for the button that saves the editing
   * @param editCancelTxt - Label for the button that cancels the editing
   */
  this.editArea = function (feature, buttonId, infowindow, editDoneTxt, editCancelTxt) {
    var mapThis = this;
    var button = document.getElementById(buttonId);

    button.addEventListener("click", function () {
      mapThis._editInPrgrs = true;
      infowindow.close();
      var centerControlDiv = document.createElement('div');
      centerControlDiv.style.display = "inline-block";
      var doneBtn = new mapThis._EditAreaBtn(centerControlDiv, feature, 'done', editDoneTxt, mapThis);
      var cancelBtn = new mapThis._EditAreaBtn(centerControlDiv, feature, 'cancel', editCancelTxt, mapThis);

      centerControlDiv.index = 1;
      mapThis._map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
      mapThis._map.data.overrideStyle(feature, {editable: true});
    });
  };

  /**
   * Enables showing tooltips when clicking on an area
   * @param options: array which contains options for the tooltip (hover : boolean, propertiesToDisplay : object,
   * editable : boolean, editBtnTxt : string, editDoneTxt : string, editCancelTxt : string)
   */

  this.setupInfoWindow = function (options) {
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
    this.getInfoWindowforArea(hover, propertiesToDisplay, editable, editBtnTxt, editDoneTxt, editCancelTxt);
  };

  /**
   * Generates center coordinates for a polygon
   * @param geometry
   */
  this.getCentroid = function (geometry) {
    var f;
    var x = 0;
    var y = 0;
    var nPts = geometry.length;
    var j = nPts - 1;
    var area = 0;

    for (var i = 0; i < nPts; j = i++) {
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
    return new google.maps.LatLng(x / f, y / f);
  };

  /**
   * Generates a tooltip for an area
   * @param toolTipOnHover - boolean, whether or not tooltip appears with hovering
   * @param properties - An array of objects with name(property name) and displayName(String to display)
   * @param editable - boolean, whether or not the area can be edited
   * @param editBtnTxt - Label for the area editing button
   * @param editDoneTxt - Label for finishing the area editing
   * @param editCancelTxt - Label for cancelling the area editing
   */
  this.getInfoWindowforArea = function (toolTipOnHover, properties, editable, editBtnTxt, editDoneTxt, editCancelTxt) {
    var mapThis = this;
    var ev;
    var content;

    if (toolTipOnHover) {
      ev = 'mouseover';

    } else {
      ev = 'click';
    }
    var infowindow = new google.maps.InfoWindow({});
    this._map.data.addListener(ev, function (event) {
      if (!mapThis._editInPrgrs) {
        var paths = [];
        event.feature.getGeometry().forEachLatLng(function (e) {
          paths.push(e)
        });
        var polyCenter = mapThis.getCentroid(paths);
        content = "";

        properties.forEach(function (property) {
          var value = event.feature.getProperty(property.name);
          if (value != undefined) {
            content += "<b> " + property.displayName + ":</b> " + value + "<br/>";
          }
        });

        if (toolTipOnHover) {
          mapThis.buildInfoWindow(content);
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
          infowindow.open(mapThis._map, this);

          if (editable) {
            mapThis.editArea(event.feature, 'editArea', infowindow, editDoneTxt, editCancelTxt);
          }
        }
      }
    });

    if (!(toolTipOnHover)) {
      infowindow.addListener("closeclick", function () {
        content = "";
        infowindow.close();
      });
    }
  };

  /**
   * Returns Google Static Maps picture url for the input feature. Size parameter default value is "400x400". Format
   * default value is "png"
   * @param {Feature} feature
   * @param {String} size
   * @param {String} format
   * @return {String} url
   */
  this.getScreenshot = function (feature, size, format) {
    size = size || "400x400";
    format = format || "png";
    var paths = "color:0x" + this._usedColors[feature.getProperty(this._propertyToGroupBy)].replace("#", "") +
      "|fillcolor:0x" + this._usedColors[feature.getProperty(this._propertyToGroupBy)].replace("#", "") + "|weight:2|enc:";
    var latlngs = [];

    feature.getGeometry().getArray()[0]["b"][0].forEachLatLng(function (e) {
      latlngs.push(new google.maps.LatLng(parseFloat(e.lat()), parseFloat(e.lng())));
    });
    paths += google.maps.geometry.encoding.encodePath(latlngs);

    return "https://maps.googleapis.com/maps/api/staticmap?format=" + format + "&size=" + size + "&path=" + paths + "&key=" + this._apiKey;
  };

  this._randomString = function (length_) {

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
};