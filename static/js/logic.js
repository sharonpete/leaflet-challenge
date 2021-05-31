console.log('logic.js is loaded');

// API endpoint
//var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  //"2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// GET request to the query URL
d3.json(queryUrl).then(function(data) {
//d3.json("../static/data/all_week.geojson").then(function(data) {
    // get a response, sent the data.features object to the createFeatures function
    var quakeMap = createFeatures(data.features);

    L.geoJSON(data, {
        pointToLayer:  function(feature, latlng) {
            return L.circleMarker(latlng,
                style = {
                radius: markerSize(feature.properties.mag),
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity:  0.90,
                fillOpacity: 0.70
            });
        }
    }).addTo(quakeMap);

    

});


function createFeatures(feature) {
    
    // function to run once for each feature in the features array in the geojson
    // each feature has a popup with place and time of earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "&nbsp; Magnitude: " + feature.properties.mag +
            "&nbsp; Depth: " + feature.geometry.coordinates[2] + " km </p>");

        
    }

   
    // create GeoJSON layer containing the features array on the earthquakeData object
    // run the onEachFeature function once for each data item in the array... why does this work???
    var earthquakes = L.geoJSON(feature, {
        onEachFeature: onEachFeature
    });

    // send earthquakes layer to the createMap function
    return createMap(earthquakes);
}


function createMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "streets-v11",
        accessToken: API_KEY
      });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "dark-v10",
        accessToken: API_KEY
      });

    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "satellite-v9",
        accessToken: API_KEY
      });

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Outdoors Map": outdoorsmap,
        "Satellite Map": satellitemap
    };

    var overlayMaps = {
          Earthquakes: earthquakes
    };

    var quakeMap = L.map("mapid", {
        center: [37.09, -95.71],  //Dearing, Kansas ... for reasons?
        zoom: 5,
        layers: [darkmap, earthquakes]
    });

    // create layer control
    // pass in baseMaps and overlayMaps
    // add layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(quakeMap);

    // create legend
    var legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var labels = ['<strong>Earthquake Depth</strong>']
        var depths = [90, 70, 50, 30, 10, -10];
                
        depths.forEach(function(depth, index) {
            div.innerHTML+= 
            labels.push("<i class='circle' style = 'background: " + depthColor(depth) + "'>" + depth + " km </i>"
            );
            
            
        });
        div.innerHTML = labels.join("<br>");
        console.log(div);
        return div;
    };
    
    legend.addTo(quakeMap);
    

    
    return quakeMap;
}

function markerSize(magnitude) {
    return magnitude * 5;
}

function depthColor(depth) {
    if (depth > 90) {
        return "#9d0208";
    } else if (depth > 70) {
        return "#dc2f02";
    } else if (depth > 50) {
        return "#e85d04";
    } else if (depth > 30) {
        return "#f48c06";
    } else if (depth > 10) {
        return "#faa307";
    } else if (depth <= 10) {
        return "#ffba08";
    }
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
