/* Example from Leaflet Quick Start Guide*/

// new variable assigned to mapid div with set center and zoom
var mymap = L.map('mapid').setView([51.505, -0.09], 13);

// tileLayer added to the map
var OpenStreetMap_France = L.tileLayer('http://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 20,
	attribution: '&copy; Openstreetmap France | &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

// marker object in London
var marker = L.marker([51.5, -0.09]).addTo(mymap);

// Circle object in London
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

// Polygon object in London
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

// Popups for the marker, circle, and polygon.  Marker starts with a popup
marker.bindPopup("<strong>Hello world!</strong><br />I am a popup.").openPopup();
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// standalone popup set at a certain lat/long and a content.  Opens automatically
var popup = L.popup()
    .setLatLng([51.5, -0.09])
    .setContent("I am a standalone popup.")
    .openOn(mymap);

// Variable popup assigned to when popup is called
var popup = L.popup();

// function to assign a popup with lat and long when clicked
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

// function that will be called for each feature layer
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

//GeoJSON feature
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

// creates a geoJSON layer that takes geoJSON objects and options objects
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(mymap);

var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// creates a geoJSON layer
L.geoJSON(myLines, {
    style: myStyle
}).addTo(mymap);

var myLayer = L.geoJSON().addTo(mymap);

// adds a geoJSON object to the geojsonFeature layer
myLayer.addData(geojsonFeature);

// created a geoJSON feature of North Dakota and Colorado
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];

// new geoJSON layer styling with red for a Republican case and blue for Democratic
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(mymap);

// creates a variable to be used as the style of a geoJSON Marker
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};


L.geoJSON(geojsonFeature, {

    // creates a layer for geoJSON points
    pointToLayer: function (feature, latlng) {

        // returns a circle marker with a center of latlng and options of the
        // geojsonMarkerOptions variable
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(mymap);

// cretes two new features, where its boolean value for 'show_on_map' needs to
// be true to be visible
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];

L.geoJSON(someFeatures, {

    // filter decides whether or not to show a feature
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(mymap);

// when the map is clicked, calls the onMapClick function
mymap.on('click', onMapClick);
