# [Example page](https://maps-js-lib.herokuapp.com) #
# [Test results page](https://maps-js-lib.herokuapp.com/test.html) #

# [Project vision and requirements](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Project vision and requirements) #
# [Project plan](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Project plan) #
# [Customer Meetings](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Customer Meetings) #
# [UI wireframes](https://bitbucket.org/MMartiM/maps-js-lib/wiki/UI%20wireframes) #
# [Release notes](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Release notes) #

# [Peer review](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Peer%20review) #

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
3. Import Google Maps to your HTML file, make sure to also include the geometry library and use the function name "initialize" as the callback. (**example below**)
4. Download "lib" and "dist" folders to your project
5. import "dist/shp.min.js" to your HTML file if you want to import Shapefile to Google Maps (**example below**)
6. Import "lib/maps.js" to your HTML file (**example below**)
7. The id of the div where google maps is used must be 'map'. Alternatively, change the first argument of createMap function in the "initialize" function in maps.js. (In the future, this step will be done automatically)

```
#!html
<script src="dist/shp.min.js"></script>
<script src="lib/maps.js"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_GOES_HERE&libraries=geometry&callback=initialize"></script>

```  

# How to use #
Loading from localStorage
---
```
#!javascript
maps.loadDataFromLocalStorage()
```  
Loads areas on the map from browser local storage.  

Saving to localStorage
---
```
#!javascript
maps.saveDataToLocalStorage()
```  
Saves areas on the map to browser local storage.  

New area creation
---
```
#!javascript
maps.createNewArea()
```  
Enables creating a new area on the map by marking corners of the area.  

GeoJSON importing
---
```
#!javascript
maps.importGeoJson(data:Object[, prop:String])
```  
Imports areas on the map from the given GeoJSON object and groups them by the given property, if specified.  

Deleting areas
---
```
#!javascript
maps.deleteAreas(id:String, selected:boolean)
```  
Deletes an area by the "id" property value and if area is selected.  

Area property editing
---
```
#!javascript
maps.editProperties(id:String, prop:String, value:String)
```  
Edits an area's property value. "id" is the "id" property value of the area. "prop" is the name of the property to edit. "value" is the new value of the property.  

Example: 
```
#!javascript
maps.editProperties("12", "owner", "Bob")
```  



Listening for selections
---
```
#!javascript
maps.listenForAreaSelections(callback)
```  
Starts to listen for area selections and sends the selected areas to the callback.  

Example:  
```
#!javascript
maps.listenForAreaSelections(maps.deleteAreas)  
```  



Select all
---
```
#!javascript
maps.selectAllAreas()
```  
Adds every area on the map to the selection.  

Clear selection
---
```
#!javascript
maps.clearSelectedAreas()
```  
Clears current selection.  

Selecting an area by id
---
```
#!javascript
maps.selectArea(id:String)
```  
Adds an area to the selection by "id" property value.  

Deselecting an area by id
---
```
#!javascript
maps.deselectArea(id:String)
```  
Removes an area from the selection by "id" property value.  

Get selection
---
```
#!javascript
maps.getSelectedAreas()
```  
Returns the current selection list.  

Display all areas
---
```
#!javascript
maps.displayAllAreas()
```  
Displays every loaded area on the map.  

Display areas by properties
---
```
#!javascript
maps.displayAreasByProperty(propertyValue:Object)
```  
Filters areas displayed on the map by given properties and their values.  

Example:
```
#!javascript
maps.displayAreasByProperty({"crop": ["wheat", "hay"], "owner": ["Bob"]})
```  



Toggle colorblind colors
---
```
#!javascript
maps.toggleColorblind()
```  
Toggles colorblind colors.  

Grouping areas
---
```
#!javascript
maps.groupAreasByProperty(property:String)
```  
Groups (colors) areas on the map by the given property.  

Tooltip setup
---
```
#!javascript
maps.setupInfoWindow(options:Object)
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
maps.setupInfoWindow({
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
maps.getScreenshot(feature:Feature[,size:String, format:String])
```  
Returns screenshot URL of the given area. Size is by default "400x400". Format is by default "png".