# [Testing page](https://maps-js-lib.herokuapp.com) #

# [Project vision and requirements](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Project vision and requirements) #
# [Project plan](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Project plan) #
# [Customer Meetings](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Customer Meetings) #
# [UI wireframes](https://bitbucket.org/MMartiM/maps-js-lib/wiki/UI%20wireframes) #
# [Release notes](https://bitbucket.org/MMartiM/maps-js-lib/wiki/Release notes) #

# How to install #
1. Have a Google App API key
2. Enable Google Maps Javascript API and Google Maps Static Maps API from the API Manager at https://console.developers.google.com
3. Import Google Maps to your HTML file, make sure to also include the geometry library and use the function name "initialize" as the callback. (example below)
4. Import "lib/maps.js" to your HTML file (example below)
5. Assign correct values for the variable in the beginning of maps.js file. These are needed for he library to work correctly

```
#!html
<script src="lib/maps.js"></script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_GOES_HERE&libraries=geometry&callback=initialize"></script>

```