# ALA Map Plugin


## Migration to Grails 3 and 4
    * If leflet version or resource is changed, the images path in MapTagLib.groovy also need update, 
    otherwise leaflet marker may not be shown  

## Status
Master: [![Build Status](https://travis-ci.org/AtlasOfLivingAustralia/ala-map-plugin.svg?branch=master)](https://travis-ci.org/AtlasOfLivingAustralia/ala-map-plugin)

Dev: [![Build Status](https://travis-ci.org/AtlasOfLivingAustralia/ala-map-plugin.svg?branch=dev)](https://travis-ci.org/AtlasOfLivingAustralia/ala-map-plugin)


## API

### [Click here for the full API documentation](http://atlasoflivingaustralia.github.io/ala-map-plugin/api/ALA.html)

## Demo

### [Click here for some examples](http://atlasoflivingaustralia.github.io/ala-map-plugin/examples.html)


## Why?

Many ALA applications require mapping features, and to date all of them have had their own custom implementations.
This results in a mix of implementations, inconsistent code, and inconsistent behaviour. The requirements, particularly
around displaying maps or occurrence data, are basically the same for all apps. This plugin will encourage consistency
across all ALA applications.


### Why a grails plugin instead of a JS library?

So we can support server-side code like looking up regions from the ALA Layers service, or Occurrences from ALA Biocache.

The JS files could be extracted into a standalone, generic mapping library if so desired. In fact, this would be a useful
thing to do at some point.

## Usage instructions

### Creating a map

* Create a ```div``` with an ```id``` (unique id for the map container) and a ```data-leaflet-img``` (location of the leaflet images) attribute.
  * The ```MapTagLib``` gives a tag for this:

```
  <m:map id="myMap"/>
```
* Create a new ALA.Map object:
```
var myMap = new ALA.Map(id, {})
```
* See the API Doco for details of the options.
* To listen to major events for the map (layers/features added/removed etc), simply call
```
myMap.subscribe(function() {...})
```

### Creating an ALA Occurrence Map

The occurrence map gives a map with the accompanying facet controls to allow the user to control the occurrences that are displayed on the map. This is similar to the filter panel & map tab from the biocache. 

* Create a ```div``` with an ```id``` (unique id for the map container) and a ```data-leaflet-img``` (location of the leaflet images) attribute.
  * The ```MapTagLib``` gives a tag for this:

```
  <m:occurrenceMap id="myMap"/>
```
* Create a new ALA.OccurrenceMap object, providing it the base URL for the biocache instance/hub you are using (e.g. https://biocache.ala.org.au), the initial query string to use to populate the map, and an optional configuration object:
```
var myOccurrenceMap = new ALA.OccurrenceMap(id, 'https://biocache.ala.org.au', 'q=Acacia', {})
```
* See the API Doco for details of the options.
* To listen to major events for the map (facet changes, layers/features added/removed etc), simply call
```
myOccurrenceMap.map.subscribe(function() {...})
```

## Features

### Version 4
Updated grails to 4.1.1 and leaflet and other javascript dependencies to newer versions.

### Version 3
* Upgraded plugin from Grails 2 to Grails 3.
* Added `autoZIndex` to preserve zIndex of added layers.
* Added `preserveZIndex` to prevent the default behaviour of bringing the selected layer to the front.
* Added `addLayersControlHeading` to include heading on Leaflet layer selector.
* Added `trackWindowHeight` to adjust map height with browser window height.
* Added `minMapHeight` to set a minimum height of map when trackWindowHeight is true.
* Default maxZoom update to 21.
* Added `otherLayers` which specifies the base layers that will be available (including the default baseLayer).
* Added `overlays` parameter to init map with passed overlays.
* `circlemarker` drawing option is by default false.
* Fullscreen button added by default.
* New control LegendImage to show Geoserver's legend as image.
* WMS layer default opacity increased to 0.5.
* Loading gif removed when location lookup fails.
* Zoom after resolving location using Geocoder lookup.

### Version 2.1.1
* Added a new option called editOptions. This is passed to edit control in Leaflet Draw.
* Polygon self intersection is disabled by default.

### Version 2.1.0
* Fix bugs of creating marker from search
* Fix issue of spin icon

### Version 2

* Occurrence Map support
  * JQuery client with facet & colour-by support for controlling the content of an occurrence map
  * Pulls data from the specified Biocache instance
* Custom controls:
  * Select box
  * Legend

### Version 1.1
* Built in options to:
  * display a 'Use My Location' button on the map
  * perform a geocoding address search (default implementation uses http://nominatim.openstreetmap.org/)
  * display standard drawing controls for polylines, polygons, circles, points, rectangles, with edit capabilities
  * reset the map
  * display the lat/lng of the mouse position
* Simplified events - you can 'subscribe' to the map to receive notifications of major events such as new layers/features, removed layers/features, etc.
  * There is also support for registering listeners for more fine-grained Leaflet events
* The map is only initialised when the container is visible - this avoids common issues such as map sizing when the container is on a separate tab that is not visible when the page loads. It can also improve page load performance if the map is not on the view port.
* Minimal base layer from [CartoDB](https://cartodb.com/basemaps/), plus ESRI World Image layer as defaults
* Custom controls:
  * Two-step selection control (two side-be-side select boxes to allow selection of, for example, known regions by category)
  * Checkbox control
  * Radio button control
  * Slider control
* Support for limiting the number of layers/shapes/markers that can added at a time (see the ```singleDraw```, ```singleMarker``` and ```markerOrShapeNotBoth``` options in the API doco)
* Simple zoom and fit-bounds functions
* Improved WMS layer support, with built-in functionality to retrieve features for layers
* Support for clustered markers via https://github.com/Leaflet/Leaflet.markercluster ([demo](http://leaflet.github.io/Leaflet.markercluster/example/marker-clustering-realworld.388.html))
* Smart mouse wheel scroll: the mouse wheel will only zoom the map if the mouse has been over the map for a certain amount of time or is clicked. This resolves cases where the map 'steals' the scroll when trying to scroll down the page. Uses https://github.com/CliffCloud/Leaflet.Sleep

### Updating the doco
This doco is built using [JSDoc3](http://usejsdoc.org/) and stored on the gh-pages branch of this repository. The syntax for JSDoc is a bit quirky: basically, make sure you include ```@memberOf [parent]``` in the comments for nested objects/functions, and ```@function``` for functions or ```@var``` for variables.

### To generate the doco
* Check out the gh-pages branch into a different directory
```
git clone https://github.com/AtlasOfLivingAustralia/ala-map-plugin ala-map-plugin-gh-pages

cd ala-map-plugin-gh-pages

git checkout gh-pages
```
* In the root of the main directory (not the gh-pages branch):
  * Install npm if you don't already have it
  * Install jsdoc3 if you don't already have it (```npm install jsdoc```)
  * Install the jsdoc3-bootstrap template if you don't already have it (```npm install jsdoc3-bootstrap```)
  * Run jsdoc: ```./node_modules/.bin/jsdoc web-app/js/* -t ./node_modules/jsdoc3-bootstrap/ -d [gh_pages_loc]/api```, where ```[gh_pages_loc]``` is the path to the directory you cloned the gh-pages branch to (don't miss the /api on the end).
  * Commit the changes to the gh-branch

## Custom Leaflet controls and layers

#### SmartWMS Layer

This is a small extension to the standard Leaflet L.TileLayer.WMS layer which adds the ability for the layer to automatically fetch the bounding box for the selected PID.

There should be no need to use this class directly: the ```ALA.Map.addWmsLayer``` function will create a SmartWMS layer: all you need to do is set the URLs in the Map options (```wmsLayerUrl``` and ```wmsFeatureUrl```) and specify the PID in the addWmsLayer call.

This layer lets us call ```ALA.Map.getGeoJSON``` and retrieve a valid GeoJSON object with the bounding polygon and the pid in the properties. See also _WMS Layers & GeoJSON_ below.

#### TwoStepSelector Control

A map control with 2 combo boxes, for two-step selection of a map feature.

Example:

```
var regionOptions = {
  id: "regionSelection",
  title: "Select a known shape",
  firstStepPlaceholder: "Choose a layer...",
  secondStepPlaceholder: "Choose a shape...",
  firstStepItems: [
      {key: 'cl2111', value: 'NRM'},
      {key: 'cl1048', value: 'IBRA 7 Regions'},
      {key: 'cl1049', value: 'IBRA 7 Subregions'},
      {key: 'cl22', value: 'Australian states'},
      {key: 'cl959', value: 'Local Gov. Areas'}
  ],
  secondStepItemLookup: function (selectedLayerKey, populateStep2Callback) {
      $.ajax({
          url: fcConfig.featuresService + '?layerId=' + selectedLayerKey,
          dataType: 'json'
      }).done(function (data) {
          var layers = [];
          data.forEach(function (layer) {
              layers.push({key: layer.pid, value: layer.name});
          });

          layers = _.sortBy(layers, "value");
          populateStep2Callback(layers);
      });
  },
  selectionAction: function (selectedValue) {
      var wmsOptions = {
          format: "image/png",
          layers: "ALA:Objects",
          version: "1.1.0",
          srs: "EPSG:900913",
          viewparams: "s:" + selectedValue
      };

      spatialFilter.addWmsLayer(fcConfig.spatialWms + "/wms/reflect?", wmsOptions);
  }
};
var regionSelector = new L.Control.TwoStepSelector(regionOptions);

spatialFilter.addControl(regionSelector);
```

## GeoJSON

This plugin works with the standard GeoJSON, as defined at http://geojson.org/, with one exception: it adds support for
Circle types.

This is achieved by adding two items to the ```properties``` object of the feature: ```point_type: "Circle"``` and ```radius: {m}```.
The ```geometry``` object will still represent a Point type.

Using the ```properties``` object allows us to generate valid GeoJSON without losing the circle metadata.

Two utility methods are provided to convert the ```geometry``` object to/from a non-standard representation with ```type: "Circle"``` if you require this structure:

* ```ALA.MapUtils.getGeometryWithCirclesFromGeoJSON```
* ```ALA.MapUtils.getStandardGeoJSONForCircleGeometry```

Note however, that the GeoJSON object MUST be converted back to the standards-compliant form before being passed back into the map.

Furthermore, if you pass a valid GeoJSON object with

```
  ...
  geometry: {
    type: "Point"
    ...
  }
```

and

```
  ...
  properties: {
    point_type: "Circle",
    radius: {m}
}
```

to ```ALA.Map.setGeoJSON```, then the plugin will render that point as a circle.

### WMS Layers & GeoJSON

WMS layers themselves cannot be represented as GeoJSON. However, the ```L.TileLayer.SmartWMS``` custom wms layer provides the ability to create a basic GeoJSON object which represents the layer as a POLYGON, where the points are the bounding box of the region, and the ```properties``` object contains the PID of the layer.

For example, the ACT layer is represented as the following:

```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "pid": "3742602",
        // plus other feature properties like area_km and layer details
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              "148.761582",
              "-35.92208"
            ],
            [
              "148.761582",
              "-35.1119459999999"
            ],
            [
              "150.772781",
              "-35.1119459999999"
            ],
            [
              "150.772781",
              "-35.92208"
            ],
            [
              "148.761582",
              "-35.92208"
            ]
          ]
        ]
      }
    }
  ]
}
```

## Geocoding

The Geocoding widget is provided by https://github.com/perliedman/leaflet-control-geocoder, and is using the defaults from that library.

The default geocoding provider is http://nominatim.openstreetmap.org/.

## Resources

This plugin makes use of:

* The GeoJSON standard: [http://geojson.org/](http://geojson.org/)
* The Underscore JS library: [http://underscorejs.org/](http://underscorejs.org/)
* Turf, a geospatial library from Mapbox: [http://turfjs.org/static/docs/](http://turfjs.org/static/docs/)
* Leaflet.Draw, a Leaflet plugin which provides the drawing controls we use: [https://github.com/Leaflet/Leaflet.draw](https://github.com/Leaflet/Leaflet.draw)
* Leaflet.markercluster, a Leaflet plugin which provides clustering support for markers: [https://github.com/Leaflet/Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster)
* ...plus other, more specific, plugins
