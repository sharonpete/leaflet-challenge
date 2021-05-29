console.log('logic.js is loaded');

// create the tile layer for the background of the map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

// initialize the LayerGroups
var layers = {
    COMING_SOON: new L.LayerGroup()
};

// create the map with the layers
var map = L.map("mapid", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [
        layers.COMING_SOON
    ]
});

// add 'lightmap' tile layer to the map
lightmap.addTo(map);

