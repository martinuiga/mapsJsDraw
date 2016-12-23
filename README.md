# [Example page](https://maps-js-lib.herokuapp.com) #
# [Test results page](https://maps-js-lib.herokuapp.com/test.html) #

# [Project vision and requirements](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Project vision and requirements) #
# [Project plan](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Project plan) #
# [Customer Meetings](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Customer Meetings) #
# [UI wireframes](https://bitbucket.org/MMartiM/maps-js-lib/wiki/UI%20wireframes) #
# [Release notes](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Release notes) #

# [Peer review](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Peer%20review) #
# [Response to peer review](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Response%20to%20peer%20review) #

# How to install #
1. Get Google App API key
: Go to the API Console. https://console.developers.google.com
: From the projects list, select a project or create a new one.
: If the API Manager page isn't already open, open the menu  Gallery Menu  and select API Manager.
: On the left, choose Credentials.
: Click Create credentials and then select API key. 
2. Enable Google Maps Javascript API and Google Maps Static Maps API from the API Manager at https://console.developers.google.com
: If the API Manager page isn't already open, open the console menu and select API Manager, and then select Library.
: Click the API you want to enable. If you need help finding the API, use the search field.
: Click ENABLE.
3. Import Google Maps to your HTML file, make sure to also include the geometry library and use the function name "maps.initMaps" as the callback. (**example below**)
4. Download "lib" and "dist" folders to your project
5. import "dist/shp.min.js" to your HTML file if you want to import Shapefile to Google Maps (**example below**)
6. Import "lib/maps.js" to your HTML file (**example below**)
7. To create a map on the page:
```
#!html
var map1 = new maps.Maps(MY_API_KEY, 'mapDiv');

```  


```
#!html
<script src="dist/shp.min.js"></script>
<script src="lib/maps.js"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_GOES_HERE&libraries=geometry&callback=maps.initMaps"></script>

```  

# How to use #
Loading from localStorage
---
```
#!javascript
.loadDataFromLocalStorage()
```  
Loads areas on the map from browser local storage.  

Saving to localStorage
---
```
#!javascript
.saveDataToLocalStorage()
```  
Saves areas on the map to browser local storage.  

New area creation
---
```
#!javascript
.createNewArea()
```  
Enables creating a new area on the map by marking corners of the area.  

GeoJSON importing
---
```
#!javascript
.importGeoJson(data:Object[, prop:String])
```  
Imports areas on the map from the given GeoJSON object and groups them by the given property, if specified.  

Deleting areas
---
```
#!javascript
.deleteAreas(id:String, selected:boolean)
```  
Deletes an area by the "id" property value and if area is selected.  

Area property editing
---
```
#!javascript
.editProperties(id:String, prop:String, value:String)
```  
Edits an area's property value. "id" is the "id" property value of the area. "prop" is the name of the property to edit. "value" is the new value of the property.  

Example: 
```
#!javascript
.editProperties("12", "owner", "Bob")
```  



Listening for selections
---
```
#!javascript
.listenForAreaSelections(callback)
```  
Starts to listen for area selections and sends the selected areas to the callback.  

Example:  
```
#!javascript
.listenForAreaSelections(maps.deleteAreas)  
```  



Select all
---
```
#!javascript
.selectAllAreas()
```  
Adds every area on the map to the selection.  

Clear selection
---
```
#!javascript
.clearSelectedAreas()
```  
Clears current selection.  

Selecting an area by id
---
```
#!javascript
.selectArea(id:String)
```  
Adds an area to the selection by "id" property value.  

Deselecting an area by id
---
```
#!javascript
.deselectArea(id:String)
```  
Removes an area from the selection by "id" property value.  

Get selection
---
```
#!javascript
.getSelectedAreas()
```  
Returns the current selection list.  

Display all areas
---
```
#!javascript
.displayAllAreas()
```  
Displays every loaded area on the map.  

Display areas by properties
---
```
#!javascript
.displayAreasByProperty(propertyValue:Object)
```  
Filters areas displayed on the map by given properties and their values.  

Example:
```
#!javascript
.displayAreasByProperty({"crop": ["wheat", "hay"], "owner": ["Bob"]})
```  



Toggle colorblind colors
---
```
#!javascript
.toggleColorblind()
```  
Toggles colorblind colors.  

Grouping areas
---
```
#!javascript
.groupAreasByProperty(property:String)
```  
Groups (colors) areas on the map by the given property.  

Tooltip setup
---
```
#!javascript
.setupInfoWindow(options:Object)
```  

Enables and configures tooltip that is shown when clicking (or hovering) on an area based on the given options.

Possible options:  

* hover - Determines if tooltip appears when hovering on an area (true/false). Default is false.
* editable - Determines if area can be edited (true/false). Default is false. 
* editBtnTxt - Changes area editing button text. Default is "Edit area".
* editDoneTxt - Changes editing "done" button text. Default is "Done".
* editCancelTxt - Changes editing "cancel" button text. Default is "Cancel".
* properties - Array containing objects with keys "name" and "displayName". "name" is the name of the property to show in the tooltip and "displayName" is how the name of the property is shown in the tooltip.

Example:  
```
#!javascript
map1.setupInfoWindow({
      editable: true,
      editBtnTxt: "Change coordinates",
      editDoneTxt: "Save",
      editCancelTxt: "Abort",
      properties: [
        { name: "id", displayName: "ID"},
        { name: "name", displayName: "Field name"},
        { name: "number", displayName: "Nr"},
        { name: "crop_name", displayName: "Crop"}
      ]
    });
```  


Area screenshot
---
```
#!javascript
.getScreenshot(feature:Feature[,size:String, format:String])
```  
Returns screenshot URL of the given area. Size is by default "400x400". Format is by default "png".  



Adding a marker with info on hover
---
```
#!javascript
.addMarker(lng:int, lat:int, info:Object)
```  
Creates a marker at the given coordinates. When hovering on the marker, the given info is displayed in an infowindow.

Example:
```
#!javascript
map1.addMarket(29, 58, {"City": "Some city 1", "Info2": "Some info"})
```