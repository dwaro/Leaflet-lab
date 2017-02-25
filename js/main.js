/* Script by David J. Waro, 2017 */

//initialize function called when the script loads
function initialize(){

    cities();
    createMap();

};

//function to create a table with cities and their populations
function cities(){

    //defines an object for cities and population
    var cityPop = [
        {
            city: 'Seattle',
            population: 652405

        },
        {
            city: 'Salt Lake City',
            population: 191180
        },
        {
            city: 'Boulder',
            population: 103166
        },
        {
            city: 'Portland',
            population: 609456
        }
    ];

    //append the table element to the div
    $("#mydiv").append("<table>");

    //append a header row to the table
    $("table").append("<tr>");

    //add the "City" and "Population" columns to the header row
    $("tr").append("<th>Country</th><th>Population Change</th>");

    //loop to add a new row for each city
    for (var i = 0; i < cityPop.length; i++){

        //assign longer html strings to a variable
        var rowHtml = "<tr><td>" + cityPop[i].city + "</td><td>" + cityPop[i].population + "</td></tr>";

        //add the row's html string to the table
        $("table").append(rowHtml);

    // for loop close
    };

    //Call addColumns function
    addColumns(cityPop);

    //Call addEvents function
    addEvents(cityPop);

// cities function close
};

// Function to add columns of the city population description
function addColumns(cityPop){

  // For each loop with an anonymous function to look at the different populations
  $('tr').each(function(i){

    // if statement to set the first cell of the column to the City Size table
    // header
    if (i == 0){

      // appends 'City Size' as the column header
      $(this).append('<th>Growth Rank</th>');

    } else {

        // create a variable for city size
        var citySize;

        // Assigns Small to populations of less than 100,000
        if (cityPop[i-1].population < 100000){

          citySize = 'Small';

          // Assigns Medium to populations less than 100,000 < x < 500,000
        } else if (cityPop[i-1].population < 500000){

          citySize = 'Medium';

          // Defaults to a large city assignment
        } else {

          citySize = 'Large';

        };

    // appends the city size to the document
    $(this).append('<td>' + citySize + '</td>');

    // Original else close
    };

  // Loop close
  });

// addColumns function close
};

// function to addEvents to the div
function addEvents(){

  $('table').mouseover(function() {

    // set a color variable
    var color = "rgb(";

    // for loop to create a random color
	  for (var i = 0; i < 3; i++) {

      // random number
      var random = Math.round(Math.random() * 255);

      // add the random number to the different color spots
	  	color += random;

	  	if (i < 2) {

        // adds the , to color to separate the random numbers
        color += ",";

	  	} else {

        // adds the closing parentheses for the color
        color += ")";

	   	};

      // table color changes when mouseover event occurs
	  	$(this).css('color', color);
      //$(this).css('color', "rgb(0, 255, 204)");

    // loop close
	  };

  // close for mouseover event
  });

  // function to give an alert
   function clickme(){

     alert('Hey, you clicked me!');

   };

   // call clickme function when table is clicked
   $('table').on('click', clickme);

// addEvents function close
};

// Title added
$("#title").append('Western Hemisphere Population Growth 1980-2015');

//$("#choro").append('<button class="reexpress" title="Reexpress">Choropleth</button>');

////////////////////////////////////////////////////////////////////////////////
/* Code for Map div */


//function to instantiate the Leaflet map
function createMap(){

  //create the map
  var map = L.map('mapid', {
    center: [15, -75],
    zoom: 2
  });

  $("#choro").append('<button class="reexpress" title="Reexpress">Choropleth</button>');

    var MapboxLayer = L.tileLayer('https://api.mapbox.com/styles/v1/djwaro/cizivimln001r2rp3d5dtsfei/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGp3YXJvIiwiYSI6ImNpdXJwYnRidTAwOWgyeXJ2ZnJ6ZnVtb3AifQ.1ajSBLNXDrHg6M7PE_Py_A', {
      minZoom: 2,
      maxZoom: 6,
    });

    // https: also suppported.
    var Countries_Light = L.tileLayer('https://api.mapbox.com/styles/v1/djwaro/cizk7j6xc00052so1e41ow871/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGp3YXJvIiwiYSI6ImNpdXJwYnRidTAwOWgyeXJ2ZnJ6ZnVtb3AifQ.1ajSBLNXDrHg6M7PE_Py_A', {
	    attribution: '',
      minZoom: 2,
      maxZoom: 6,
    }).addTo(map);

    //calls getData function
    getData(map, MapboxLayer, Countries_Light);

// close to createMap
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 30;
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
         fillColor: "rgb(0, 255, 204)",
         color: "#000",
         weight: 1,
         opacity: 1,
         fillOpacity: 0.4
       };

       var popDecline = {
         fillColor: "rgb(128,0,0)",
         color: "#000",
         weight: 1,
         opacity: 1,
         fillOpacity: 0.4
       };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]) - 1;

    if (attValue > 0) {
      options.radius = calcPropRadius((attValue * 100));
      var layer = L.circleMarker(latlng, options);
    } else {
      attValue = ((1 - Number(feature.properties[attribute]))* 100);
      popDecline.radius = calcPropRadius(attValue);
      var layer = L.circleMarker(latlng, popDecline);
    };

    //build popup content string starting with city...Example 2.1 line 24
    var panelContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";

    //add formatted attribute to popup content string
    var yearOne = attribute.split("_")[2];
    var yearTwo = attribute.split("_")[3];

    panelContent += "<p><b>Population growth from " + yearOne + " to "
      + yearTwo + ":</b> " + parseFloat(((feature.properties[attribute]) - 1) * 100).toFixed(2)
      + "% </p>";

    //Example 1.3 line 6...in UpdatePropSymbols()
    var popup = new Popup(feature.properties, layer, options.radius);

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
function createPropSymbols(data, map, attributes, MapboxLayer, Countries_Light){
    //create a Leaflet GeoJSON layer and add it to the map
    var proportionalSymbols = L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    });

    changeMap(map, MapboxLayer, Countries_Light, proportionalSymbols);

};

function changeMap (map, MapboxLayer, Countries_Light, proportionalSymbols) {

  var maptype = 1;
  map.addLayer(proportionalSymbols);

  $('.reexpress').click( function() {

    if (maptype == 1) {
      map.removeLayer(Countries_Light);
      map.removeLayer(proportionalSymbols);
      map.addLayer(MapboxLayer);
      maptype = 0;
    } else {
      map.removeLayer(MapboxLayer);
      map.addLayer(proportionalSymbols);
      map.addLayer(Countries_Light);
      maptype = 1;
    };

  });

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
          // Adds reverse image.
          //$('#reverse').html('<img src="img/reverse.png">');

          $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
          // Adds forward image.  Right arrow by Guilhem from the Noun Project
          //$('#forward').html('<img src="lib/images/forward.png">');

          //kill any mouse event listeners on the map
          $(container).on('mousedown dblclick', function(e){
            L.DomEvent.stopPropagation(e);
          });

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

//OOM Popup constructor function
function Popup(properties, layer, radius){
  this.properties = properties;
  this.layer = layer;
  this.content = "<p><b>Country:</b> " + this.properties.Country + "</p>";

  this.bindToLayer = function(){
    this.layer.bindPopup(this.content, {
      offset: new L.Point(0,-radius),
      closeButton: false
    });
  };
};

function createLegend(map, attributes){

  var LegendControl = L.Control.extend({
    options: {
      position: 'bottomright'
    },

    onAdd: function (map) {

      // create the control container with a particular class name
      var legendContainer = L.DomUtil.create('div', 'legend-control-container');

      $(legendContainer).append(attribute.split("_")[2] + " - " + attribute.split("_")[3]);

      //kill any mouse event listeners on the map
      // $(legendContainer).on('mousedown dblclick', function(e){
      //   L.DomEvent.stopPropagation(e);
      // });

      return legendContainer;

    }
  });

  map.addControl(new LegendControl());

};

// Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
      if (layer.feature && layer.feature.properties[attribute]){

            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(((props[attribute]) - 1) * 100);

            if (radius > 0) {
              layer.setRadius(radius);
            } else {
              layer.setRadius(radius);
            }

            //add country to popup content string
            var panelContent = "<p><b>Country:</b> " + props.Country + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[2];
            var yearDos = attribute.split("_")[3];

            panelContent += "<p><b>Population growth from " + year + " to " + yearDos + ":</b> "
            + parseFloat(((props[attribute]) - 1) * 100).toFixed(2) + "% </p>";

            //Example 1.3 line 6...in UpdatePropSymbols()
            var popup = new Popup(props, layer, radius);

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
function getData(map, MapboxLayer, Countries_Light){
    //load the data
    $.ajax("data/AssignmentOne.geojson", {
        dataType: "json",
        success: function(response){

          //create an attributes array
          var attributes = processData(response);

          //call function to create proportional symbols
          createPropSymbols(response, map, attributes, MapboxLayer, Countries_Light);
          createSequenceControls(map, attributes);
        }
    });
};

//////////////////////////////////////////////////////////

//call the initialize function when the document has loaded
$(document).ready(initialize);



// // AJAX function accesses the geojson file for AssignmentOne
// function debugAjax(){
//
//   // variable to store response of json file
// 	var mydata;
//
//   // defines jQuery AJAX method
// 	$.ajax("data/AssignmentOne.geojson", {
// 		dataType: "json",
// 		success: function(response){
//
//       // set mydata to a value inside of the anonymous function
//       mydata = response;
//
//       // logs the geojson AssignmentOne file of an object constituting of a
//       // featureclass of 15 arrays
//       console.log("This is the data: ", mydata);
//
//       // calls callback function passing 'mydata' as a parameter
//       debugCallback(mydata);
//
//     // close to success: function(response)
//     }
//
//
//   // close to ajax
// 	});
//
//   // checks to see if the data is accessable outside of the ajax method
//   console.log("This is undefined: ", mydata);
//
// // close for debugAjax
// };
//
// // function to take in the geo
// function debugCallback(response){
//
//   // appends the MegaCities object of arrays to the div as a string
//   $("#mydiv").append('<br>GeoJSON data: </br>'  + JSON.stringify(response));
//
// // close for debugCallback
// };

// //function to convert markers to circle markers
// function pointToLayer(feature, latlng, attributes){
//     //Determine which attribute to visualize with proportional symbols
//     var attribute = attributes[0];
//
//     //create marker options
//     var options = {
//       fillColor: "rgb(0, 255, 204)",
//       color: "#000",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.4
//     };
//
//     var popDecline = {
//       fillColor: "rgb(128,0,0)",
//       color: "#000",
//       weight: 1,
//       opacity: 1,
//       fillOpacity: 0.4
//     };
//
//     //For each feature, determine its value for the selected attribute
//     var attValue = (Number(feature.properties[attribute]) - 1);
//
//     if (attValue > 0) {
//       options.radius = calcPropRadius((attValue) * 100);
//       var layer = L.circleMarker(latlng, options);
//     } else {
//       attValue = (1 - Number(feature.properties[attribute]));
//       popDecline.radius = calcPropRadius((attValue) * 100);
//       var layer = L.circleMarker(latlng, popDecline);
//     };
//
//     //build popup content string starting with city...Example 2.1 line 24
//     var panelContent = "<p><b>Country:</b> " + feature.properties.Country + "</p>";
//
//     //add formatted attribute to popup content string
//     var yearOne = attribute.split("_")[2];
//     var yearTwo = attribute.split("_")[3];
//
//     panelContent += "<p><b>Population growth from " + yearOne + " to "
//       + yearTwo + ":</b> " + parseFloat(((feature.properties[attribute]) - 1) * 100).toFixed(2)
//       + "% </p>";
//
//     //popup content is now just the city name
//     var popupContent = feature.properties.Country;
//
//     //bind the popup to the circle marker
//     layer.bindPopup(popupContent, {
//
//         // positions the popup above in a consistent space
//         offset: new L.Point(0,-options.radius, -popDecline.radius),
//
//         // gets rid of close button on the popup
//         closeButton: false
//     });
//
//     //event listeners to open popup on hover
//     layer.on({
//       mouseover: function(){
//         this.openPopup();
//       },
//       mouseout: function(){
//         this.closePopup();
//       },
//       click: function(){
//             $("#infoPanel").html(panelContent);
//       }
//     });
//
//     //return the circle marker to the L.geoJson pointToLayer option
//     return layer;
// };
