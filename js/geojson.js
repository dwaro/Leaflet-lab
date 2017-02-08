/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
  //create the map
  var map = L.map('mapid', {
    center: [20, 0],
    zoom: 3
  });

  // add a tile layer, used from OSM
  var Stamen_Terrain = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
	  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	  subdomains: 'abcd',
	  minZoom: 0,
	  maxZoom: 18,
	  ext: 'png'
  }).addTo(map);

  // ajax method to get MegaCities.geojson and asign its points to circleMarkers
  $.ajax("data/MegaCities.geojson", {
    dataType: "json",
    success: function(response){

      //create marker options
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };

      //create a Leaflet GeoJSON layer and add it to the map
      L.geoJson(response, {
        pointToLayer: function (feature, latlng){
          return L.circleMarker(latlng, geojsonMarkerOptions);
        }
      }).addTo(map);

    // success close
    }

  // ajax close
  });

// close to createMap
};

$(document).ready(createMap);
