var map; //gmaps
var json; // variable for geojson
var base = 'pollud_failide_formaat.zip'; // source of shhapefile
shp(base).then(function (data) { //use converter to get geojson
    json = data; //assign geojson to the variable
});

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: new google.maps.LatLng(2.8, -187.3),
        mapTypeId: 'terrain'
    });
    /*console.log('äääää');
    console.log(json);
    for (var area in json) {
        if (json.hasOwnProperty(area)) {
            //console.log(json[area]);

            for (var sth in json[area]) {
                if (json[area].hasOwnProperty(sth) && area === "features") {
                    //console.log(json[area][sth]);
                    //console.log(sth);

                    for (var sthelse in json[area][sth]) {
                        if (json[area][sth].hasOwnProperty(sthelse) && sthelse === "properties") {
                            //console.log(json[area][sth][sthelse]);

                            for (var kultuur in json[area][sth][sthelse]) {
                                if (json[area][sth][sthelse].hasOwnProperty(kultuur) && kultuur === "kultuur") {
                                    console.log(decodeURIComponent(escape(json[area][sth][sthelse][kultuur])));
                                }
                            }
                        }
                    }
                }
            }
        }
    }*/
    map.data.addGeoJson(json); //load does not work with local files, so addGgeoJson is used
    map.data.addListener('mouseover', function (event) {
        console.log(event.feature.getProperty('kultuur'));
    });
    map.data.addListener('click', function (event) {
        map.data.overrideStyle(event.feature, {fillColor: 'red'});
    })

}