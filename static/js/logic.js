var zoomLevel = 10;
var chicagoCoords = [41.8781, -87.6232]
// Creating map object
let newMarker = [];
let geojsonLayer;
let unique_crime;
let graph_zip = "60612"
// console.log(crimeZip);

let crimeBarChart;
let crimePieChart;
var atlBtn;
var arunBtn;
let myMap;



// Create the createMap function
function createMap(crimeSpots, heatMap, geoMap) {
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
    "Zip Code Zones": geoMap
  };
  // Create the map object with options
  // Define a map object
  myMap = L.map("map", {
    center: chicagoCoords,
    zoom: zoomLevel,
    layers: [streetmap, geoMap]
  });
  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
// console.log(chicagoGeoJsonData);
//write code to read the chicago_geojson.js file using d3.
// call createZipCodeZones passing the data that is read from chicago_geojson.js file
// d3.selectAll("#button").on("click",flyaway());

d3.json(chicagoGeoJsonData).then(geoData => {

  createMarker(crimeZip, geoData);


});


// define createZipCodeZones function. The function takes one parameter.
// name the parameter zipCodeData
function createZipCodeZones(zipCodeData) {
  // create an object named options.
  // specify the callback for style, filter, and onEachFeature

  let options = {
    onEachFeature: onEachFeature,
    style: onStyle,
    filter: onFilter,
  };

  // create geojsonLayer Object. pass Chicago Zip Code Data and options as the parameter
  // add the geojson layer to the map
  geojsonLayer = L.geoJSON(zipCodeData, options);
  //geojsonLayer.addTo(myMap);
  // define the filter object
  /*************************************************/

  function onFilter(geoJsonFeature) {
    if (geoJsonFeature.properties.ZIP) {
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
      fillColor: color(geoJsonFeature.properties.ZIP),
    };
    //set the fillcolor value based on the ZIP Code
    return style;
  }

  /************************************************* */

  function onEachFeature(feature, layer) {
    //set the popup text. put the ZIP CODE inside h1 tag
    //console.log(feature)

    let popuptext;
    if (feature.properties.ZIP === "6761") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip">${"60607"}</h2>`;
    }
    else if (feature.properties.ZIP === "12311") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip">${"60611"}</h2>`;
    }
    else if (feature.properties.ZIP === "60666") {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip">${"60018"}</h2><button id="atl-btn">Fly to Atlanta</button><button id= "arun-btn">Fly to Arun's</button>`;
    }
    else {
      popuptext = `<h3>ZIP CODE</h3><hr><h2 id="zip">${feature.properties.ZIP}</h2>`;
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
        fillOpacity: 1,
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
      graph_zip=extractContent(content);
      
      updateChartData();
      upDateChartTitle();
      if (graph_zip === "60018") {
        atlBtn = L.DomUtil.get('atl-btn');
        L.DomEvent.addListener(atlBtn, 'click', function () {
          flyaway(0);
        });
        arunBtn = L.DomUtil.get('arun-btn');
        L.DomEvent.addListener(arunBtn, 'click', function () {
          flyaway(1);
        });
      }

    }
  }

  /*********************************************************/
}
// Create the createMarkers function
function createMarker(response, geoJsonData) {
  //console.log(d3.select("#zip").text());

  var crimeMarkers = [];
  var heatArray = [];
  primary_crime = [];

  response.forEach((r) => {
    try {
      let lat = r.latitude;
      let long = r.longitude;
      let latlng = [lat, long];
      // if (r.case_number == "JD473872" || "JD473929" ||  "JD474123"){
      //   console.log(r.zip_code);
      // }
      var arrest = "";
      if (r.arrest) {
        arrest = "Yes"
      }
      else {
        arrest = "No"
      }

      console.log(r.zip_code)
      primary_crime.push(r.primary_type);
      crimeMarkers.push(L.marker(latlng, {
        draggable: false,
        title: r.primary_type,
        riseOnHover: true,
        icon: getIcon(r.primary_type)


      }).bindPopup(`<h6>Case Number: ${r.case_number}</h6>
        <h3 style="color:red;">Crime: ${r.primary_type}</h3>
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

  createZipCodeZones(geoJsonData);
  createMap(marker_layer, heat_layer, geojsonLayer);
  createGraphs();


}
/*****************************************************************/
function getIcon(key) {
  // Initialize an object containing icons for each layer group
  //console.log(key);
  let icons = {
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
      iconColor: "white",
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
    "BURGLARY": L.ExtraMarkers.icon({
      icon: "ion-ios-home-outline",
      iconColor: "white",
      markerColor: "violet",
      shape: "star",
    }),
    "OTHER OFFENSE": L.ExtraMarkers.icon({
      icon: "ion-help-circled",
      iconColor: "white",
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
      iconColor: "grey",
      markerColor: "gold",
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
      icon: "ion-social-reddit-outline",
      iconColor: "violet",
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
function color(ZIP) {

  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);




  return randomColor;
}



/*********************************************************/
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
function twenty0neGuns() {
  var crimeColors = [];
  for (var i = 0; i < 21; i++) {
    crimeColors.push(color());
  }
  return crimeColors;
}
$(".button").on('click', flyaway());
function flyaway(where) {

  var dest = [[33.7490, -84.3880], [34.12969738165099, -84.15845427143529]];
  myMap.flyTo(dest[where], 12, {
    animate: true,
    duration: 5,
    easeLinearity: 0.25,
  });

}
function extractContent(html) {

  var contentString=new DOMParser().parseFromString(html, "text/html").documentElement.textContent;
  var numb = contentString.match(/\d/g);
  return numb.join("");

}



