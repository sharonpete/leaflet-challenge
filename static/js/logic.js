console.log('logic.js is loaded');

// initialize the LayerGroups
var layers = {
    COMING_SOON: new L.LayerGroup()
};

// create the map with the layers
var quakeMap = L.map("mapid", {
    //center: [45.52, -122.67],
    center: [48.3689, -103.77155634166667],
    zoom: 4, layers: [
        layers.COMING_SOON
    ]
});

// create the tile layer for the background of the map

L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "streets-v11",
     accessToken: API_KEY
}).addTo(quakeMap);

console.log('map loaded?');



// add 'lightmap' tile layer to the map
//lightmap.addTo(quakeMap);

// create overlays object to add to the layer control
var overlays = {
    'Coming Soon': layers.COMING_SOON
};

// control for layers, and add overlay layers to map
L.control.layers(null, overlays).addTo(quakeMap);

// legend to display information about quakeMap
var quakeInfo = L.control({
    position: 'bottomright'
});

// insert div with class of 'legend'
quakeInfo.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
};

// add the quakeInfo legend to the map
quakeInfo.addTo(quakeMap);

// icons for each layer group
var quakeIcons = {
    COMING_SOON: L.icon({
        icon: "ion-settings",
        iconColor: "red",
        markerColor: "yellow",
        shape: "triangle"
    })
};

d3.json("../static/data/all_week.geojson").then(function(data) {
    console.log(data);
});
