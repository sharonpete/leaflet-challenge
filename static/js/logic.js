console.log('logic.js is loaded');

// Set your mapbox api key here:
// const API_KEY = "YOUR MAPBOX API KEY GOES HERE";

// If you do not have a mapbox api key, use these data files in lieu of the two endpoints below.
// var quakeUrl = "../static/data/all_week.geojson"
// var plateUrl = "../static/data/PB2002_plates.json";

// API endpoint - if you need to use the files, comment out these these two URL and use the two above
var quakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var plateUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


// GET request to the query URL
d3.json(quakeUrl).then(function(quakeData) {

    d3.json(plateUrl).then(function(plateData) {
    // get a response, sent the data.features object to the createFeatures function
        console.log(plateData);
        createFeatures(quakeData.features, plateData.features);
    });
});


function createFeatures(quakeData, plateData) {
    
    // function to run once for each feature in the features array in the geojson
    // each feature has a popup with place and time of earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h4>" + feature.properties.place +
        "</h4><hr><p>" + new Date(feature.properties.time) +
        "&nbsp; Magnitude: " + feature.properties.mag +
        "&nbsp; Depth: " + feature.geometry.coordinates[2] + " km </p>");
    }

   
    // create GeoJSON layer containing the features array on the earthquakeData object
    // run the onEachFeature function once for each data item in the array... why does this work???
    var earthquakes = L.geoJSON(quakeData, {
        //onEachFeature: onEachFeature
        
        pointToLayer: function (feature, latlng) {  
            //console.log(latlng);

            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: depthColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity:  0.90,
                fillOpacity: 0.70
            }).bindPopup("<h4>" + feature.properties.place +
            "</h4><hr><p>" + new Date(feature.properties.time) +
            "&nbsp; Magnitude: " + feature.properties.mag +
            "&nbsp; Depth: " + feature.geometry.coordinates[2] + " km </p>");
        }
    });

    var plates = L.geoJSON(plateData, {
        style: function (feature) {
            return {
                color: 'orange',
                weight: 2
            };
        }
    });
    // send earthquakes layer to the createMap function
    createMap(earthquakes, plates);
}


function createMap(earthquakes, plates) {
    // var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    //     tileSize: 512,
    //     maxZoom: 18,
    //     zoomOffset: -1,
    //     id: "streets-v11",
    //     accessToken: API_KEY
    //   });

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
        //"Street Map": streetmap,
        "Dark Map": darkmap,
        "Outdoors Map": outdoorsmap,
        "Satellite Map": satellitemap
    };

    var overlayMaps = {
          'Earthquakes': earthquakes,
          'Tectonic Plates': plates
    };

    var quakeMap = L.map("mapid", {
        center: [37.09, -95.71],  //Dearing, Kansas ... for reasons?
        zoom: 4,
        layers: [darkmap, earthquakes, plates]
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
            labels.push("<i class='rectangle' style = 'background: " + depthColor(depth) + "'>" + depth + " </i> kilometers"
            );           
        });
        div.innerHTML = labels.join("<br>");
        //console.log(div);
        return div;
    };
    
    legend.addTo(quakeMap);

    quakeMap.on('overlayremove', function (eventLayer) {
        if (eventLayer.name === 'Earthquakes') {
            this.removeControl(legend);
        }
    });

    quakeMap.on('overlayadd', function(eventLayer) {
        if (eventLayer.name === 'Earthquakes') {
            legend.addTo(this);
        }
    });
}

function markerSize(magnitude) {
    return magnitude * 5;
}

function depthColor(depth) {
    if (depth >= 90) {
        return "#f94144";
    } else if (depth >= 70) {
        return "#f3722c";
    } else if (depth >= 50) {
        return "#f9c74f";
    } else if (depth >= 30) {
        return "#90be6d";
    } else if (depth >= 10) {
        return "#43aa8b";
    } else if (depth <= 10) {
        return "#577590";
    }
}



