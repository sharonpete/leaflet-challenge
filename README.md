# leaflet-challenge
Leaflet - Visualizing Data with Leaflet

### Introduction
This Leaflet work was completed using data from the United States Geological Survey or USGS.  From the assignment: "The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change.  Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes."

The purpose of this work was to build some tools to visualize earthquake data for USGS.  They collect a massive amount of data from all over the world each day and need a meaningful way to display it.

The earthquake data comes from [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php).  The feed selected was 'All Earthquakes' for the Past 7 days.

The tectonic plate data comes from [https://github.com/fraxen/tectonicplates](https://github.com/fraxen/tectonicplates)
The raw tectonic plate data may be viewed [here]("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json")


#### Set up instructions:
This dashboard uses several map styles from MapBox. For the best experience:
- Download the Git repository
- Add a 'config.js in the /static/js directory with API_KEY = "Your MapBOX API KEY" and save the file.
- Right click on index.html and select 'Open with Live Server'

Alternately:
- Download the Git repository
- The repository can be used without an API_KEY, but it requires the user to open the /static/js/logic.js file in Visual Studio Code and follow the directions at the top of the file.  Comment out the two URLs using the API call and uncomment the two name-matched URLs which use local data files found in /static/data.  
- Save logic.js.
- Right click on index.html and select 'Open with Live Server'

#### How it works
The map is initially displayed using a Dark Map with both the Earthquakes and Tectonic Plates overlays selected. Other available map styles are the Outdoors Map and the Satellite Map. 
- Each earthquake is represented on the map by its location, using latitude and longitude provided by USGS.
- Additional information can be viewed by clicking the circle to view a popup with the reported location, the date and time of the earthquake, the earthquake's magnitude and depth. 
- The _size of the circle_ represents the relative *magnitude* of the earthquake.  
- The _color of the circle_ indicates the *depth* of the earthquake. 
- There is a legend in the lower righthand corner that indicates the *Earthquake Depth* color, based on the *depth* in kilometers.  If the Earthquakes overlay is unselected, the Earthquake Depth legend will also be removed from the map.  
- There is a second overlay indicating the Earth's *Tectonic Plates*.  This overlay may also be unselected / selected. 
- There are certain areas that have many reported earthquakes.  The best way to examine those is to zoom into that part of the map in order to see some separation of the earthquake circle markers.

