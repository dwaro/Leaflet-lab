/* Script by David J. Waro, 2017 */

//initialize function called when the script loads
function initialize(){
    createMap();
};


// Title added
$("#title").append('Western Hemisphere Population Growth 1980-2015');


//function to instantiate the Leaflet map
function createMap(){

  //create the map
  var map = L.map('mapid', {
    center: [15, -75],
    maxBounds: [ [-75, -200], [82, 50] ],
    zoom: 3
  });

  // base tile layer
  var Countries_Light = L.tileLayer('https://api.mapbox.com/styles/v1/djwaro/cizywe9py006x2so5g4wkk90p/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGp3YXJvIiwiYSI6ImNpdXJwYnRidTAwOWgyeXJ2ZnJ6ZnVtb3AifQ.1ajSBLNXDrHg6M7PE_Py_A', {
	  attribution: '',
    minZoom: 2,
    maxZoom: 5,
  }).addTo(map);

  //calls getData function
  getData(map);

}; // close to createMap





//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {

  //scale factor to adjust symbol size evenly
  var scaleFactor = 10;

  //area based on attribute value and scale factor
  var area = attValue * scaleFactor;

  //radius calculated based on area
  var radius = Math.sqrt(area/Math.PI);

  // return the radius of the circle
  return radius;

}; // close to calcPropRadius





// function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes, layer){

  // determine which attribute to visualize with proportional symbols
  var attribute = attributes[0];

  // create marker options
  var options = {
    fillColor: "#80bfff",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.7
  };

  // For each feature, determine its value for the selected attribute
  var attValue = Number(feature.properties[attribute]) - 1;

  // calculate the radius and assign it to the radius of the options marker.
  // Multiplied by 1000 to give differentiation between the attribute values
  // since they are originally so small as a hundredth decimal place on pop.
  // growth
  options.radius = calcPropRadius((attValue * 1000));

  // assign the marker with the options styling and using the latlng repsectively
  var layer = L.circleMarker(latlng, options);


  // panel content string starting with country
  var panelContent = "<p><b><br>Country:</b></br> " + feature.properties.Country + "</p>";

  // add formatted attribute to panel content string
  var yearOne = attribute.split("_")[2]; // split on the 3rd _
  var yearTwo = attribute.split("_")[3]; // split on the 4th _

  // add the years of population growth and round the decimals to two places
  panelContent += "<p><b>Population growth <br>from " + yearOne + " to "
    + yearTwo + ":</br></b> " + parseFloat(((feature.properties[attribute]) - 1) * 100).toFixed(2)
    + "% </p>";

  // new flag element to be added to a new div representing each country
  var flag = document.createElement("img");
    flag.setAttribute("height", "150");
    flag.setAttribute("width", "225");

  // variable to hold the hyperlink for the flags
  var href;

  // if statement assigns the proper flag image and link to href for each respective
  // country
  if (feature.properties.Country == 'Argentina') {
    flag.src = 'img/argentina-flag.gif';
    flag.setAttribute("alt", "Argentina flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ar.html';
  } else if (feature.properties.Country == 'Bahamas') {
    flag.src = 'img/bahamas-flag.gif';
    flag.setAttribute("alt", "Bahamas flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/bf.html';
  } else if (feature.properties.Country == 'Barbados') {
    flag.src = 'img/barbados-flag.gif';
    flag.setAttribute("alt", "Barbados flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/bb.html';
  } else if (feature.properties.Country == 'Belize') {
    flag.src = 'img/belize-flag.gif';
    flag.setAttribute("alt", "Belize flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/bh.html';
  } else if (feature.properties.Country == 'Bolivia') {
    flag.src = 'img/bolivia-flag.gif';
    flag.setAttribute("alt", "Bolivian flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/bl.html';
  } else if (feature.properties.Country == 'Brazil') {
    flag.src = 'img/brazil-flag.gif';
    flag.setAttribute("alt", "Brazilian flag");
    href = 'https://www.cia.gov/library/publications/resources/the-world-factbook/geos/br.html';
  } else if (feature.properties.Country == 'Canada') {
    flag.src = 'img/canada-flag.gif';
    flag.setAttribute("alt", "Canadian flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ca.html';
  } else if (feature.properties.Country == 'Chile') {
    flag.src = 'img/chile-flag.gif';
    flag.setAttribute("alt", "Chilean flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ci.html';
  } else if (feature.properties.Country == 'Colombia') {
    flag.src = 'img/colombia-flag.gif';
    flag.setAttribute("alt", "Colombian flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/co.html';
  } else if (feature.properties.Country == 'Costa Rica') {
    flag.src = 'img/costa_rica-flag.gif';
    flag.setAttribute("alt", "Costa Rican flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/cs.html';
  } else if (feature.properties.Country == 'Cuba') {
    flag.src = 'img/cuba-flag.gif';
    flag.setAttribute("alt", "Cuban flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/cu.html';
  } else if (feature.properties.Country == 'Dominican Republic') {
    flag.src = 'img/dominican_republic-flag.gif';
    flag.setAttribute("alt", "Dominican Republic flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/dr.html';
  } else if (feature.properties.Country == 'Ecuador') {
    flag.src = 'img/ecuador-flag.gif';
    flag.setAttribute("alt", "Ecuadoran flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ec.html';
  } else if (feature.properties.Country == 'El Salvador') {
    flag.src = 'img/el_salvador-flag.gif';
    flag.setAttribute("alt", "El Salvadoran flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/es.html';
  } else if (feature.properties.Country == 'Guatemala') {
    flag.src = 'img/guatemala-flag.gif';
    flag.setAttribute("alt", "Guatemalan flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/gt.html';
  } else if (feature.properties.Country == 'Haiti') {
    flag.src = 'img/haiti-flag.gif';
    flag.setAttribute("alt", "Haitian flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ha.html';
  } else if (feature.properties.Country == 'Honduras') {
    flag.src = 'img/honduras-flag.gif';
    flag.setAttribute("alt", "Honduran flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ho.html';
  } else if (feature.properties.Country == 'Jamaica') {
    flag.src = 'img/jamaica-flag.gif';
    flag.setAttribute("alt", "Jamaican flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/jm.html';
  } else if (feature.properties.Country == 'Mexico') {
    flag.src = 'img/mexico-flag.gif';
    flag.setAttribute("alt", "Mexican flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/mx.html';
  } else if (feature.properties.Country == 'Nicaragua') {
    flag.src = 'img/nicaragua-flag.gif';
    flag.setAttribute("alt", "Nicaraguan flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/nu.html';
  } else if (feature.properties.Country == 'Panama') {
    flag.src = 'img/panama-flag.gif';
    flag.setAttribute("alt", "Panamanian flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/pm.html';
  } else if (feature.properties.Country == 'Paraguay') {
    flag.src = 'img/paraguay-flag.gif';
    flag.setAttribute("alt", "Paraguay flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/pa.html';
  } else if (feature.properties.Country == 'Peru') {
    flag.src = 'img/peru-flag.gif';
    flag.setAttribute("alt", "Peruvian flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/pe.html';
  } else if (feature.properties.Country == 'Suriname') {
    flag.src = 'img/suriname-flag.gif';
    flag.setAttribute("alt", "Suriname flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ns.html';
  } else if (feature.properties.Country == 'Trinidad and Tobago') {
    flag.src = 'img/trinidad_and_tobago-flag.gif';
    flag.setAttribute("alt", "Trinidad and Tobago flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/td.html';
  } else if (feature.properties.Country == 'United States') {
    flag.src = 'img/us-flag.gif';
    flag.setAttribute("alt", "American flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/us.html';
  } else if (feature.properties.Country == 'Uruguay') {
    flag.src = 'img/uruguay-flag.gif';
    flag.setAttribute("alt", "Uruguay flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/uy.html';
  } else if (feature.properties.Country == 'Venezuela') {
    flag.src = 'img/venezuela-flag.gif';
    flag.setAttribute("alt", "Venezuelan flag");
    href = 'https://www.cia.gov/library/publications/the-world-factbook/geos/ve.html';
  };

  // when the flag is clicked, open a new window of the linked webpage
  flag.onclick = function() {
    window.open(href, '_blank');
  };

  // creates a new popup object
  var popup = new Popup(feature.properties, layer, options.radius);

  // add popup to circle marker
  popup.bindToLayer();

  // event listeners to open popup on hover
  layer.on({
    mouseover: function(){
      this.openPopup();
    },
    mouseout: function(){
      this.closePopup();
    },
    click: function(){
      $("#infoPanel").html(panelContent); // add the info panel
      $("#flags").html(flag); // add the flag
      $("#redirect").html('Click for more information!'); // show the click affordance once the panel is visible
    }
  });

  // return the circle marker to the L.geoJson pointToLayer option
  return layer;

}; // close to pointToLayer function





// funtion to create the search control
function search (map, data, proportionalSymbols){

  // new variable search control
  var searchLayer = new L.Control.Search({
    position: 'topleft',  // positions the operator in the top left of the screen
    layer: proportionalSymbols,  // use proportionalSymbols as the layer to search through
    propertyName: 'Country',  // search for country name
    marker: false,
    moveToLocation: function (latlng, title, map) {

      // set the view once searched to the circle marker's latlng and zoom
      map.setView(latlng, 13);

    } // close to moveToLocation
  }); // close to var searchLayer

  // add the control to the map
  map.addControl (searchLayer);

}; // close to search function





// add circle markers for point features to the map
function createPropSymbols(data, map, attributes){

  // create a Leaflet GeoJSON layer and add it to the map
  var proportionalSymbols = L.geoJson(data, {
    pointToLayer: function(feature, latlng){
      return pointToLayer(feature, latlng, attributes);
    }
  }).addTo(map);

  // call search funtion
  search(map, data, proportionalSymbols)

}; // close ot createPropSymbols





// Create new sequence controls
function createSequenceControls(map, attributes, index){

  // position the sequence control in the bottom left of the map
  var SequenceControl = L.Control.extend({
    options: {
      position: 'bottomleft'
    },

    onAdd: function (map) {

      // create the control container div with a particular class name
      var container = L.DomUtil.create('div', 'sequence-control-container');

      //creates range input element (slider)
      $(container).append('<input class="range-slider" type="range">');

      //add forward and reverse buttons
      $(container).append('<button class="skip" id="reverse" title="Reverse"><b><</b></button>');
      $(container).append('<button class="skip" id="forward" title="Forward"><b>></b></button>');

      //turn off any mouse event listeners on the sequence control
      $(container).on('mousedown dblclick', function(e){
        L.DomEvent.stopPropagation(e);
      });

      return container;

    } // close to onAdd
  }); // close to var SequenceControl

  // add the Sequence Control to the map
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

    // update the proportional symbols based off of the slider
    updatePropSymbols(map, attributes[index]);

  });

  // when the skip button is clicked
  $('.skip').click(function(){

    // get the old index value
    var index = $('.range-slider').val();

    // if forward button is clicked
    if ($(this).attr('id') == 'forward'){

      // increment index
      index++;
      // if past the last attribute, wrap around to first attribute
      index = index > 6 ? 0 : index;

    } else if ($(this).attr('id') == 'reverse'){ // if reverse button is clicked

      // decrement index
      index--;
      // if past the first attribute, wrap around to last attribute
      index = index < 0 ? 6 : index;

    };

    // update slider
    $('.range-slider').val(index);

    // update the proportional symbols based off of the skip buttons clicked
    updatePropSymbols(map, attributes[index]);

  }); // close to '.skip' click function

}; // close to createSequenceControls function





// OOM Popup constructor function
function Popup(properties, layer, radius){

  // creating the Popup object that can then be used more universally
  this.properties = properties;
  this.layer = layer;
  this.content = "<p><b>Country:</b> " + this.properties.Country + "</p>";

  this.bindToLayer = function(){
    this.layer.bindPopup(this.content, {
      offset: new L.Point(0,-radius),
      closeButton: false
    });
  }; // close to bindToLayer
}; // close to Popup function





// updates the temporal legend with new content
function updateLegend(map, attribute){

  var yearUno = attribute.split("_")[2]; // split on the 3rd _
  var yearTwo = attribute.split("_")[3]; // split on the 4th _

  // content to be added to the legend
  var legendContent = "<b>Population Growth from <br>" + '</br>'
    + yearUno + " to " + yearTwo + '</b>';

  // add in the text to the legend div
  $('#temporal-legend').html(legendContent);

  // get the max, mean, and min values as an object
  var circleValues = getCircleValues(map, attribute);

  // searches through circleValues array for instances where key shows up
  for (var key in circleValues){

       //get the radius
       var radius = calcPropRadius((circleValues[key] - 1 )* 1000);

       // assign the cy and r attributes
       $('#' + key).attr({
           cy: 59 - radius,
           r: radius
       });

       // add legend text for the circles
       $('#' + key + '-text').text(Math.round((circleValues[key] - 1 ) * 100) + "%");
   };
};





// Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){

  // start with min at highest possible and max at lowest possible number
  var min = Infinity,
      max = -Infinity;

  // for each layer
  map.eachLayer(function(layer){
    //get the attribute value
    if (layer.feature){
      var attributeValue = Number(layer.feature.properties[attribute]);

      //test for min
      if (attributeValue < min){
        min = attributeValue;
      };

      //test for max
      if (attributeValue > max){
        max = attributeValue;
      };
    };
  });

  //set mean
  var mean = (max + min) / 2;

  //return values as an object
  return {
    max: max,
    mean: mean,
    min: min
  };
}; // close to getCircleValues





// function to create the Proportional Symbols map legend
function createLegend(map, attributes){

  // legend control in the bottom right of the map
  var LegendControl = L.Control.extend({
    options: {
      position: 'bottomright'
    },


    onAdd: function (map) {

      // create the control container with a particular class name
      var legendContainer = L.DomUtil.create('div', 'legend-control-container');

      $(legendContainer).append('<div id="temporal-legend" >');

      // start attribute legend svg string
      var svg = '<svg id="attribute-legend" width="160px" height="60px">';

      //object to base loop on
      var circles = {
        max: 20,
        mean: 40,
        min: 60
      };

      // loop to add each circle and text to svg string
      for (var circle in circles){

        //c ircle string
        svg += '<circle class="legend-circle" id="' + circle + '" fill="#80bfff" fill-opacity="0.8" stroke="#000000" cx="30"/>';

        // text string
        svg += '<text id="' + circle + '-text" x="65" y="' + circles[circle] + '"></text>';
      };

      // close svg string
      svg += "</svg>";

      // add attribute legend svg to container
      $(legendContainer).append(svg);

      //t urn off any mouse event listeners on the legend
      $(legendContainer).on('mousedown dblclick', function(e){
        L.DomEvent.stopPropagation(e);
      });

      return legendContainer;

    } // close to onAdd
  }); // close to var LegendControl

  // add the legendControl to the map and update it
  map.addControl(new LegendControl());
  updateLegend(map, attributes[0]);

}; // close to createLegend function





// function to resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){

  // for each layer of the map
  map.eachLayer(function(layer){

    // if the layer contains both the layer feature and properties with attributes
    if (layer.feature && layer.feature.properties[attribute]){

      // access feature properties
      var props = layer.feature.properties;

      // subtract one because all pop growths will be at 1._ _ something, so we
      // want more variation
      var attValue = Number(props[attribute]) - 1;

      // multiply by 1000 to give us variation between the originally small growth
      // numbers
      var radius = calcPropRadius(attValue * 1000);

      // set the updated radius to the layer
      layer.setRadius(radius);

      // add country to popup content string
      var panelContent = "<p><b><br>Country:</br></b> " + props.Country + "</p>";

      // add formatted attribute to panel content string
      var year = attribute.split("_")[2];
      var yearDos = attribute.split("_")[3];

      // updated panel content
      panelContent += "<p><b>Population growth <br>from " + year + " to " + yearDos + ":</br></b> "
        + parseFloat(((props[attribute]) - 1) * 100).toFixed(2) + "% </p>";

      // new Popup
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

          // add updated panelContent to div
          $("#infoPanel").html(panelContent);

        }
      }); // close to layer.on

    }; // close to if statement

  }); // close to eachLayer function
  updateLegend(map, attribute); // update the temporal-legend
}; // close to updatePropSymbols function





// build an attributes array for the data
function processData(data){

  // empty array to hold attributes
  var attributes = [];

  // properties of the first feature in the dataset
  var properties = data.features[0].properties;

  // push each attribute name into attributes array
  for (var attribute in properties){

    // only take attributes with population values
    if (attribute.indexOf("Pop") > -1){
      attributes.push(attribute);
    };

  }; // close to for loop

  // return the array of attributes that meet the if statement to be pushed
  return attributes;

}; // close to processData





// import GeoJSON data
function getData(map){

  //load the data
  $.ajax("data/AssignmentOne.geojson", {
    dataType: "json",
    success: function(response){

      //create an attributes array
      var attributes = processData(response);

      //call function to create proportional symbols
      createPropSymbols(response, map, attributes);
      createSequenceControls(map, attributes);
      createLegend(map, attributes);


    } // close to success
  }); // close to ajax
}; // close to getData function



//call the initialize function when the document has loaded
$(document).ready(initialize);
