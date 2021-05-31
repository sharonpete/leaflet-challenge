console.log('logic.js is loaded');

// API endpoint
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// GET request to the query URL
d3.json(queryUrl).then(function(data) {
    // get a response, sent the data.features object to the createFeatures function
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {
    
    // function to run once for each feature in the features array in the geojson
    // each feature has a popup with place and time of earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // create GeoJSON layer containing the features array on the earthquakeData object
    // run the onEachFeature function once for each data item in the array... why does this work???
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // send earthquakes layer to the createMap function
    createMap(earthquakes);
}


function createMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
      });

      var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
      };

      var overlayMaps = {
          Earthquakes: earthquakes
      };

      var quakeMap = L.map("mapid", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
      });

      // create layer control
      // pass in baseMaps and overlayMaps
      // add layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
      }).addTo(quakeMap);
}






// // initialize the LayerGroups
// var layers = {
//     COMING_SOON: new L.LayerGroup()
// };

// // create the map with the layers
// var quakeMap = L.map("mapid", {
//     //center: [45.52, -122.67],
//     center: [48.3689, -103.77155634166667],
//     zoom: 4, layers: [
//         layers.COMING_SOON
//     ]
// });

// // create the tile layer for the background of the map

// L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     tileSize: 512,
//     maxZoom: 18,
//     zoomOffset: -1,
//     id: "streets-v11",
//      accessToken: API_KEY
// }).addTo(quakeMap);

// console.log('map loaded?');



// // add 'lightmap' tile layer to the map
// //lightmap.addTo(quakeMap);

// // create overlays object to add to the layer control
// var overlays = {
//     'Coming Soon': layers.COMING_SOON
// };

// // control for layers, and add overlay layers to map
// L.control.layers(null, overlays).addTo(quakeMap);

// // legend to display information about quakeMap
// var quakeInfo = L.control({
//     position: 'bottomright'
// });

// // insert div with class of 'legend'
// quakeInfo.onAdd = function() {
//     var div = L.DomUtil.create("div", "legend");
//     return div;
// };

// // add the quakeInfo legend to the map
// quakeInfo.addTo(quakeMap);

// // icons for each layer group
// var quakeIcons = {
//     COMING_SOON: L.icon({
//         icon: "ion-settings",
//         iconColor: "red",
//         markerColor: "yellow",
//         shape: "triangle"
//     })
// };

// d3.json("../static/data/all_week.geojson").then(function(data) {
//     console.log(data);
//     console.log(data.features);
//     console.log(data.features[0]);
    
    
// });
