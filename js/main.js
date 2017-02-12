/* Script by David J. Waro, 2017 */

//initialize function called when the script loads
function initialize(){

    cities();
    //debugAjax();
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

// AJAX function accesses the geojson file for AssignmentOne
function debugAjax(){

  // variable to store response of json file
	var mydata;

  // defines jQuery AJAX method
	$.ajax("data/AssignmentOne.geojson", {
		dataType: "json",
		success: function(response){

      // set mydata to a value inside of the anonymous function
      mydata = response;

      // logs the geojson AssignmentOne file of an object constituting of a
      // featureclass of 15 arrays
      console.log("This is the data: ", mydata);

      // calls callback function passing 'mydata' as a parameter
      debugCallback(mydata);

    // close to success: function(response)
    }


  // close to ajax
	});

  // checks to see if the data is accessable outside of the ajax method
  console.log("This is undefined: ", mydata);

// close for debugAjax
};

// function to take in the geo
function debugCallback(response){

  // appends the MegaCities object of arrays to the div as a string
  $("#mydiv").append('<br>GeoJSON data: </br>'  + JSON.stringify(response));

// close for debugCallback
};

// Title added
$("#title").append('Western Hemisphere Population Change 1980-2015');

////////////////////////////////////////////////////////////////////////////////
/* Code for Map div */

//function to instantiate the Leaflet map
function createMap(){
  //create the map
  var map = L.map('mapid', {
    center: [10, -85],
    zoom: 2
  });

  // https: also suppported.
  var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	   attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      minZoom: 2,
      maxZoom: 18,
  }).addTo(map);

  // ajax method to get AssignmentOne.geojson and asign its points to circleMarkers
  $.ajax("data/AssignmentOne.geojson", {
    dataType: "json",
    success: function(response){

      //create marker options
      var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "rgb(0, 255, 204)",
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.4
      };

      //create a Leaflet GeoJSON layer and add it to the map
      L.geoJson(response, {
        pointToLayer: function (feature, latlng){
          return L.circleMarker(latlng, geojsonMarkerOptions);//.bindPopup("Asuh Dude!");
        }
      }).addTo(map);

    // success close
    }

  // ajax close
  });

// close to createMap
};

//call the initialize function when the document has loaded
$(document).ready(initialize);
