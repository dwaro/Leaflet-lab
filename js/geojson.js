/* Map of GeoJSON data from MegaCities.geojson */

//GOAL: Proportional symbols representing attribute values of mapped features
//STEPS:
//1. Create the Leaflet map--done (in createMap())
//2. Import GeoJSON data--done (in getData())
//3. Add circle markers for point features to the map--done (in AJAX callback)
//4. Determine which attribute to visualize with proportional symbols -- done
//5. For each feature, determine its value for the selected attribute -- done
//6. Give each feature's circle marker a radius based on its attribute value -- done

//GOAL: Allow the user to sequence through the attributes and resymbolize the map
//   according to each attribute
//STEPS:
//1. Create slider widget
//2. Create skip buttons
//3. Create an array of the sequential attributes to keep track of their order
//4. Assign the current attribute based on the index of the attributes array
//5. Listen for user input via affordances
//6. For a forward step through the sequence, increment the attributes array index;
//   for a reverse step, decrement the attributes array index
//7. At either end of the sequence, return to the opposite end of the seqence on the next step
//   (wrap around)
//8. Update the slider position based on the new index
//9. Reassign the current attribute based on the new attributes array index
//10. Resize proportional symbols according to each feature's value for the new attribute

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

  // getData function call
  getData(map);

// close to createMap
};

/////////////////////////////////////////////////// Module 5 segment /////////

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string starting with city...Example 2.1 line 24
    var panelContent = "<p><b>City:</b> " + feature.properties.City + "</p>";

    //add formatted attribute to popup content string
    var year = attribute.split("_")[1];
    panelContent += "<p><b>Population in " + year + ":</b> " + feature.properties[attribute] + " million</p>";

    // creates popup by calling on popup funciton
    //createPopup(feature.properties, attribute, layer, options.radius);

    //create new popup
    var popup = new Popup(feature.properties, attribute, layer, options.radius);

    //add popup to circle marker
    popup.bindToLayer();

    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        },
        click: function(){
          $("#infoPanel").html(panelContent);
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Step 1: Create new sequence controls
function createSequenceControls(map, attributes){


  var SequenceControl = L.Control.extend({
      options: {
          position: 'bottomleft'
      },

      onAdd: function (map) {
          // create the control container div with a particular class name
          var container = L.DomUtil.create('div', 'sequence-control-container');

          //create range input element (slider)
          $(container).append('<input class="range-slider" type="range">');

          //add skip buttons
          $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
          $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');

          //kill any mouse event listeners on the map
          $(container).on('mousedown dblclick', function(e){
            L.DomEvent.stopPropagation(e);
          });

          // ... initialize other DOM elements, add listeners, etc.

          return container;
      }
  });

  map.addControl(new SequenceControl());

  //set slider attributes
  $('.range-slider').attr({
    max: 6,
    min: 0,
    value: 0,
    step: 1
  });

  // input listener for slider
  $('.range-slider').on('input', function(){
    // get the new index value
    var index = $(this).val();

    updatePropSymbols(map, attributes[index]);

  });

  $('.skip').click(function(){
       //get the old index value
       var index = $('.range-slider').val();

       //Step 6: increment or decrement depending on button clicked
       if ($(this).attr('id') == 'forward'){
           index++;
           //Step 7: if past the last attribute, wrap around to first attribute
           index = index > 6 ? 0 : index;
       } else if ($(this).attr('id') == 'reverse'){
           index--;
           //Step 7: if past the first attribute, wrap around to last attribute
           index = index < 0 ? 6 : index;
       };

       // update slider
       $('.range-slider').val(index);

       updatePropSymbols(map, attributes[index]);


   });

};


// funtion to create popups
function createPopup(properties, attribute, layer, radius){
    //add city to popup content string
    var popupContent = "<p><b>City:</b> " + properties.City + "</p>";

    //add formatted attribute to panel content string
    var year = attribute.split("_")[1];
    popupContent += "<p><b>Population in " + year + ":</b> " + properties[attribute] + " million</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius),
        closeButton: false
    });
};

//Example 1.2 line 1...Popup constructor function
function Popup(properties, attribute, layer, radius){
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.year = attribute.split("_")[1];
    this.population = this.properties[attribute];
    this.content = "<p><b>City:</b> " + this.properties.City + "</p><p><b>Population in " + this.year + ":</b> " + this.population + " million</p>";

    this.bindToLayer = function(){
        this.layer.bindPopup(this.content, {
            offset: new L.Point(0,-radius),
            closeButton: false
        });
    };
};

// Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
      if (layer.feature && layer.feature.properties[attribute]){
          //access feature properties
          var props = layer.feature.properties;

          //update each feature's radius based on new attribute values
          var radius = calcPropRadius(props[attribute]);
          layer.setRadius(radius);

          // calls createpopup funtion passing through this function's parameters
          //createPopup(props, attribute, layer, radius);

          //Example 1.3 line 6...in UpdatePropSymbols()
          var popup = new Popup(props, attribute, layer, radius);

          //add popup to circle marker
          popup.bindToLayer();
        };
    });
};

// build an attributes array for the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Pop") > -1){
            attributes.push(attribute);
        };
    };

    return attributes;
};

//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/MegaCities.geojson", {
        dataType: "json",
        success: function(response){

          //create an attributes array
          var attributes = processData(response);

          //call function to create proportional symbols
          createPropSymbols(response, map, attributes);
          createSequenceControls(map, attributes);
        }
    });
};

$(document).ready(createMap);
