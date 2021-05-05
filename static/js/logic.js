var zoomLevel = 10;
var chicagoCoords = [41.8781, -87.6232]
// Creating map object
let newMarker = [];
let geojsonLayerChicago;
let geojsonLayerGeorgia;
let unique_crime;
let graph_zip = "60612"
// console.log(crimeZip);

let crimeBarChart;
let crimePieChart;
var atlBtn;
var arunBtn;
let myMap;




// console.log(chicagoGeoJsonData);
//write code to read the chicago_geojson.js file using d3.
// call createZipCodeZones passing the data that is read from chicago_geojson.js file
// d3.selectAll("#button").on("click",flyaway());

d3.json(chicagoGeoJsonData).then(geoChicagoData => {
  d3.json(georgiaGeoJsonData).then(geoGaData =>
    createMarker(crimeZip, geoChicagoData, geoGaData))


});
// Create the createMap function
function createMap(crimeSpots, heatMap, geoChicagoMap, geoGaMap) {
  // Create the tile layer that will be the background of our map
  var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-streets-v11",
    accessToken: mapbox_key
  });
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: mapbox_key
  });
  var streetmap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
      tileSize: 512,
      maxZoom: 18,
      zoomOffset: -1,
      id: "mapbox/streets-v11",
      accessToken: mapbox_key,
    }
  );
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: mapbox_key
  });
  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap,
    "Satelitte Map": satellitemap,
    "Street Map": streetmap,
    "Dark Map": darkmap

  };
  // Create an overlayMaps object to hold the bikeStations layer
  var overlayMaps = {
    "Crime Locations": crimeSpots,
    "Crime Heat Map": heatMap,
    "Chicago Zip Code Zones": geoChicagoMap,
    "Georgia Zip Code Zones": geoGaMap,
  };
  // Create the map object with options
  // Define a map object
  myMap = L.map("map", {
    center: chicagoCoords,
    zoom: zoomLevel,
    layers: [streetmap, geoChicagoMap]
  });
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);
}

// define createZipCodeZones function. The function takes one parameter.
// name the parameter zipCodeData
function createZipCodeZones(zipCodeData, zipp) {
  // create an object named options.
  // specify the callback for style, filter, and onEachFeature

  let options = {
    onEachFeature: onEachFeature,
    style: onStyle,
    filter: onFilter,
  };

  // create geojsonLayer Object. pass Chicago Zip Code Data and Georgia Zip Code Data and options as the parameter
  // add the geojson layer to the map
  if (zipp === "ZIP") {
    geojsonLayerChicago = L.geoJSON(zipCodeData, options);
  }
  else if (zipp === "ZCTA5CE10") {
    geojsonLayerGeorgia = L.geoJSON(zipCodeData, options);
  }
  //geojsonLayer.addTo(myMap);
  // define the filter object
  /*************************************************/

  function onFilter(geoJsonFeature) {
    if (geoJsonFeature.properties[zipp]) {
      return true;
    }
    if (geoJsonFeature.properties[zipp]) {
      return true;
    }
    return true;
  }

  /************************************************* */

  function onStyle(geoJsonFeature) {
    let style = {
      color: "red",
      fillOpacity: 0.3,
      weight: 1.5,
      fillColor: color(geoJsonFeature.properties[zipp]),
    };
    //set the fillcolor value based on the ZIP Code
    return style;
  }

  /************************************************* */
  //used to build popups for each geoJsonLayer
  function onEachFeature(feature, layer) {
    //set the popup text. put the ZIP CODE inside h1 tag
    //console.log(feature)

    let popuptext;
    if (feature.properties[zipp] === "6761") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip1">${"60607"}</h2>`;
    }
    else if (feature.properties[zipp] === "12311") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip2">${"60611"}</h2>`;
    }
    else if (feature.properties[zipp] === "60666") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip3">${"60018"}</h2><button id="trvl-btn">Fly to Atlanta</button><button id= "beach-btn">Fly to Driftwood Beach</button>`;
    }
    else if (feature.properties[zipp] === "30337") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip4">${"30337"}</h2><button id="trvl-btn">Fly to Chicago</button><button id= "beach-btn">Fly to Driftwood Beach</button>`;

    }
    else if (feature.properties[zipp] === "31527") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip4">${"31527"}</h2><button id="trvl-btn">Fly to Chicago</button><button id= "trvl2-btn">Fly to Atlanta</button>`;

    }
    else {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip5">${feature.properties[zipp]}</h2>`;
    }
    layer.bindPopup(popuptext);


    // //console.log(layer);
    /*********************************************************/
    //console.log(feature.properties.ZIP);
    layer.on({
      mouseover: MouseOver,
      mouseout: MouseOut,
      click: onClick
    });

    /*********************************************************/

    function MouseOver(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.6,
      });
    }

    /*********************************************************/

    function MouseOut(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.3,
      });
    }

    /*********************************************************/

    function onClick(event) {
      // console.log(event);
      //console.log(event.target);

      layer = event.target;
      var popup = event.target.getPopup();
      var content = popup.getContent();
      graph_zip = extractContent(content);

      updateChartData();
      upDateChartTitle();
      if (graph_zip == "60018" || graph_zip == "30337") {

        trvlBtn = L.DomUtil.get('trvl-btn');
        L.DomEvent.addListener(trvlBtn, 'click', function () {
          if (graph_zip === "60018") {
            flyaway(0);
          }
          else {
            flyaway(2);
          }
        });
        
        beachBtn = L.DomUtil.get('beach-btn');
        L.DomEvent.addListener(beachBtn, 'click', function () {
          flyaway(1);
        });
      }
      else if (graph_zip === "31527"){
        trvlBtn = L.DomUtil.get('trvl-btn');
        L.DomEvent.addListener(trvlBtn, 'click', function () {
          flyaway(2)
        });
        trvlBtn2 = L.DomUtil.get('trvl2-btn');
        L.DomEvent.addListener(trvlBtn2, 'click', function () {
          flyaway(0);
        });

      }

    }
  }

  /*********************************************************/
}
// Create the createMarkers function
function createMarker(response, geoJsonChicago, geoJsonGeorgia) {
  //console.log(d3.select("#zip").text());

  var crimeMarkers = [];
  var heatArray = [];
  primary_crime = [];
  //loops through each element in result and builds arrays for markers and heat map layer
  response.forEach((r) => {
    try {
      let lat = r.latitude;
      let long = r.longitude;
      let latlng = [lat, long];
      // if (r.case_number == "JD473872" || "JD473929" ||  "JD474123"){
      //   console.log(r.zip_code);
      // }
      var arrest;
      if (r.arrest>=0) {
        arrest = "Yes"
        if(!r.arrest){
          arrest="No"
        }
      }
      else {
        arrest = "Not in the Data";
      }


      console.log(r.zip_code)
      primary_crime.push(r.primary_type);
      crimeMarkers.push(L.marker(latlng, {
        draggable: false,
        title: r.primary_type,
        riseOnHover: true,
        icon: getIcon(r.primary_type)


      }).bindPopup(`<h4>ID#:${r.id}</h4><h3 style="color:red;">Crime: ${r.primary_type}</h3>
        <h4>Description: ${r.description}<h4>
        <h4>Block: ${r.block}</h4>
        <h4>Location Description: ${r.location_description}</h4>
        <h4>Arrest: ${arrest}</h4>`)
      );
      heatArray.push(latlng);

    }
    catch (e) {
      var i = 0;
    }

  });
  var heat_layer = L.heatLayer(heatArray, {
    radius: 13,
    maxZoom: 23,
    blur: 5,
    minOpacity: 0.4,
    gradient: { 0.4: 'green', 0.65: 'yellow', 1: 'red' }
  });
  var marker_layer = L.layerGroup(crimeMarkers);
  console.log(primary_crime);
  unique_crime = primary_crime.filter((it, i, ar) => ar.indexOf(it) === i);
  console.log(unique_crime);

  createZipCodeZones(geoJsonChicago, "ZIP");
  createZipCodeZones(geoJsonGeorgia, "ZCTA5CE10")
  createMap(marker_layer, heat_layer, geojsonLayerChicago, geojsonLayerGeorgia);
  createGraphs();


}
/*****************************************************************/
//builds a list of icons to be used for specific crimes when the function is called
function getIcon(key) {
  // Initialize an object containing icons for each layer group
  console.log(key);

  let icons = {
    "AUTO THEFT": L.ExtraMarkers.icon({
      icon: "ion-model-s",
      iconColor: "white",
      markerColor: "yellow",
      shape: "circle",
    }),
    "LARCENY-NON VEHICLE": L.ExtraMarkers.icon({
      icon: "ion-sad-outline",
      iconColor: "black",
      markerColor: "orange",
      shape: "penta",
    }),
    "THEFT": L.ExtraMarkers.icon({
      icon: "ion-sad-outline",
      iconColor: "white",
      markerColor: "blue",
      shape: "star",
    }),
    "BATTERY": L.ExtraMarkers.icon({
      icon: "ion-battery-charging",
      iconColor: "white",
      markerColor: "gold",
      shape: "circle",
    }),
    "CRIMINAL DAMAGE": L.ExtraMarkers.icon({
      icon: "ion-alert-circled",
      iconColor: "yellow",
      markerColor: "red",
      shape: "penta",
    }),
    "WEAPONS VIOLATION": L.ExtraMarkers.icon({
      icon: "ion-scissors",
      iconColor: "white",
      markerColor: "green",
      shape: "square",
    }),
    "MOTOR VEHICLE THEFT": L.ExtraMarkers.icon({
      icon: "ion-model-s",
      iconColor: "white",
      markerColor: "yellow",
      shape: "circle",
    }),
    "LARCENY-FROM VEHICLE": L.ExtraMarkers.icon({
      icon: "ion-android-car",
      iconColor: "yellow",
      markerColor: "green",
      shape: "square",
    }),
    "BURGLARY": L.ExtraMarkers.icon({
      icon: "ion-social-octocat",
      iconColor: "yellow",
      markerColor: "violet",
      shape: "circle",
    }),
    "OTHER OFFENSE": L.ExtraMarkers.icon({
      icon: "ion-help-circled",
      iconColor: "green",
      markerColor: "grey",
      shape: "penta",
    }),
    "AGG ASSAULT": L.ExtraMarkers.icon({
      icon: "ion-settings",
      iconColor: "black",
      markerColor: "grey",
      shape: "circle",
    }),
    "ROBBERY": L.ExtraMarkers.icon({
      icon: "ion-cash",
      iconColor: "white",
      markerColor: "black",
      shape: "penta",
    }),
    "NARCOTICS": L.ExtraMarkers.icon({
      icon: "ion-erlenmeyer-flask",
      iconColor: "black",
      markerColor: "blue",
      shape: "square",
    }),
    "CRIMINAL TRESPASS": L.ExtraMarkers.icon({
      icon: "ion-android-walk",
      iconColor: "white",
      markerColor: "orange",
      shape: "circle",
    }),
    "PUBLIC PEACE VIOLATION": L.ExtraMarkers.icon({
      icon: "ion-speakerphone",
      iconColor: "violet",
      markerColor: "red",
      shape: "star",
    }),
    "LIQUOR LAW VIOLATION": L.ExtraMarkers.icon({
      icon: "ion-beer",
      iconColor: "yellow",
      markerColor: "green",
      shape: "circle",
    }),
    "ASSAULT": L.ExtraMarkers.icon({
      icon: "ion-hammer",
      iconColor: "black",
      markerColor: "white",
      shape: "penta",
    }),
    "DECEPTIVE PRACTICE": L.ExtraMarkers.icon({
      icon: "ion-android-contacts",
      iconColor: "blue",
      markerColor: "yellow",
      shape: "star",
    }),
    "STALKING": L.ExtraMarkers.icon({
      icon: "ion-person-stalker",
      iconColor: "violet",
      markerColor: "gold",
      shape: "square",
    }),
    "SEX OFFENSE": L.ExtraMarkers.icon({
      icon: "ion-transgender",
      iconColor: "gold",
      markerColor: "pink",
      shape: "star",
    }),
    "CRIMINAL SEXUAL ASSAULT": L.ExtraMarkers.icon({
      icon: "ion-android-hand",
      iconColor: "red",
      markerColor: "violet",
      shape: "circle",
    }),
    "OFFENSE INVOLVING CHILDREN": L.ExtraMarkers.icon({
      icon: "ion-social-reddit",
      iconColor: "yellow",
      markerColor: "green",
      shape: "penta",
    }),
    "ARSON": L.ExtraMarkers.icon({
      icon: "ion-ios-flame-outline",
      iconColor: "black",
      markerColor: "yellow",
      shape: "circle",
    }),
    "HOMICIDE": L.ExtraMarkers.icon({
      icon: "ion-social-freebsd-devil",
      iconColor: "white",
      markerColor: "red",
      shape: "star",
    }),
    "INTERFERENCE WITH PUBLIC OFFICER": L.ExtraMarkers.icon({
      icon: "ion-ios-people-outline",
      iconColor: "yellow",
      markerColor: "black",
      shape: "circle",
    })
  };
  return icons[key];
}

/*********************************************************/
//function generates random color
function color(ZIP) {

  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);




  return randomColor;
}



/*********************************************************/
//function is to build chart.js doughnut plot and bar plot
function createGraphs() {
  // console.log(graph_zip);

  let chartColors = twenty0neGuns();
  let myBarChart = document.getElementById('myBar').getContext('2d');
  // myChart.clear();
  // myChart=document.getElementById('myChart').getContext('2d');
  crimeBarChart = new Chart(myBarChart, {
    type: 'bar',
    data: {
      labels: unique_crime,
      datasets: [{
        label: `Crime for Zip Code: ${graph_zip}`,
        data: data_for_graph(),
        backgroundColor: chartColors,
        borderColor: "black",

      }]
    },
    options: {
      indexAxis: 'y',
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 2,
        }
      }
    }


  });

  let myPieChart = document.getElementById('myPie').getContext('2d');
  crimePieChart = new Chart(myPieChart, {
    type: 'doughnut',
    data: {
      labels: unique_crime,
      datasets: [{
        label: `Number of Crimes by Zip Code: ${graph_zip}`,
        data: data_for_graph(),
        backgroundColor: chartColors,
        borderColor: "black",
      }]
    },
    options: {
      legend: {
        display: false
      }
    }
  });



  // console.log("Update Graph")

}
//two functions to update chart data and chart titles
function updateChartData() {
  crimeBarChart.data.datasets[0].data = data_for_graph();

  crimeBarChart.update();
  crimePieChart.data.datasets[0].data = data_for_graph();
  crimePieChart.update();
}
function upDateChartTitle() {
  crimeBarChart.data.datasets[0].label = `Number of Crimes by Zip Code: ${graph_zip}`;
  // console.log(crimeBarChart.data.datasets[0].label)
  crimeBarChart.update();
}
//isolates data to be used for the chart.js graphs
function data_for_graph() {
  let currentZipCrime;
  // console.log(graph_zip);
  if (graph_zip === "60607") {

    currentZipCrime = crimeZip.filter((elmnt) => elmnt.zip_code.toString() === (graph_zip || "60606" || "60654" || "60661"));
  }
  else if (graph_zip === "60611") {
    currentZipCrime = crimeZip.filter((elmnt) => elmnt.zip_code.toString() === (graph_zip || "60601" || "60602" || "60603" || "60604" || "60605"));
  }
  else {
    currentZipCrime = crimeZip.filter((elmnt) => elmnt.zip_code.toString() === (graph_zip));
  }
  // console.log(currentZipCrime)
  let currentZipCrimeData = [];
  unique_crime.forEach(ucrime => {
    count = 0;

    currentZipCrime.forEach(x => {
      // console.log(ucrime);
      // console.log(x)
      if (x["primary_type"] === ucrime) {
        count += 1;
      }
    });
    currentZipCrimeData.push(count);

  });
  return currentZipCrimeData;
}
//creates a list of unique colors for the length of the unique crime array
function twenty0neGuns() {
  var crimeColors = [];
  for (var i = 0; i < unique_crime.length; i++) {
    crimeColors.push(color());
  }
  return crimeColors;
}
//flys to new destination by updating mapbox center coords
function flyaway(where) {

  var dest = [[33.6407, -84.4277], [31.1034, -81.4039], [41.9803, -87.9090]];
  myMap.flyTo(dest[where], 13.5, {
    animate: true,
    duration: 5,
    easeLinearity: 0.25,
  });

}
// extracts numbers from html content
function extractContent(html) {

  var contentString = new DOMParser().parseFromString(html, "text/html").documentElement.textContent;
  var numb = contentString.match(/\d/g);
  return numb.join("");

}



