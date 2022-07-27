/**
 * @namespace
 */
var ALA = ALA || {};

/**
 * @class
 * @memberOf ALA
 */
ALA.MapConstants = {
    /**
     * Types of drawing objects
     */
    DRAW_TYPE: {
        POINT_TYPE: "Point",
        CIRCLE_TYPE: "Circle",
        POLYGON_TYPE: "Polygon",
        LINE_TYPE: "LineString"
    },

    /**
     * Types of layers
     */
    LAYER_TYPE: {
        MARKER: "marker"
    }
};

/**
 * Object for interacting with a generic map.
 *
 * <p/>
 * <b>Options</b>
 * <ul>
 *  <li><code>autoZIndex</code> If true, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off. Default: true</li>
 *  <li><code>preserveZIndex</code> If true, a added layer will not be brought to front. It will be at the zIndex assigned. Default: false</li>
 *  <li><code>baseLayer</code> The base layer shown by default.
 *  Can be one of:
 *  - a Leaflet.Layer object, or
 *  - a string containing the name of one of the built-in base layers.
 *  Available built-in base layers: 'Minimal', 'WorldImagery', 'Detailed', 'Topographic'.
 *  Default: 'Minimal'.
 *  </li>
 *  <li><code>otherLayers</code> Specifies the base layers that will be available (including the default baseLayer).
 *  This is an object, where the keys are the display text, and values are either:
 *  - a Leaflet.Layer object, or
 *  - the name of one of the built-in base layers.
 *  Default: {'Minimal': 'Minimal', 'World Imagery': 'WorldImagery'}.
 *  </li>
 *  <li><code>overlays</code> Specify the overlays that should be added to map. The expected format is
 *   {
 *      'Australian Corals': L.tileLayer.wms
 *   }
 *  </li>
 *  <li>
 *  <code>overlayLayersSelectedByDefault</code> List of overlays to be shown on map by default. This works in conjunction
 *  with 'overlays' option. Overlays not on this list will have a checkbox to show on map. The expected format is
 *  ['Australian Corals']
 *  </li>
 *  <li><code>center</code> Centre position of the map. Default: -28, 134</li>
 *  <li><code>zoom</code> the initial zoom level. Default: 4</li>
 *  <li><code>maxZoom</code> the maximum allowed zoom level. Default: 21</li>
 *  <li><code>maxAutoZoom</code> the maximum zoom level to automatically zoom to (when zoomToObject = true). Default: 15</li>
 *  <li><code>defaultLayersControl</code> true to use the default layers control, false to use your own. Default: true</li>
 *  <li><code>addLayersControlHeading</code> true to add heading to base layer and overlay sections of the selector, false to use your own. Default: false</li>
 *  <li><code>scrollWheelZoom</code> whether to enable zooming in/out by scrolling the mouse. Default: false</li>
 *  <li><code>fullscreenControl</code> whether to include a full-screen option. Default: true</li>
 *  <li><code>fullscreenControlOptions:</code>
 *      <ul>
 *          <li><code>position</code> position of the button on the map. Default: topleft</li>
 *      </ul>
 *  <li><code>drawControl</code> whether to include drawing controls or not. Default: true</li>
 *  <li><code>drawOptions</code> if drawing control is to be included, then specify options to pass to drawing control here.</li>
 *  <li><code>editOptions</code> if edit option in drawing control is enabled, then specify options to pass to edit control here.</li>
 *  <li><code>singleDraw</code> whether to allow more than 1 shape or region to be drawn at a time. This does NOT apply to markers - only layers and other shapes. See also singleMarker and markerOrShapeNotBoth. Default: true</li>
 *  <li><code>singleMarker</code> whether to allow more than 1 marker to be drawn at a time.. Default: true</li>
 *  <li><code>markerZoomToMax</code> whether to allow zoom to maximum permitted level of current base layer</li>
 *  <li><code>markerOrShapeNotBoth</code> whether to allow users to draw both markers and regions/shapes at the same time. Default: true</li>
 *  <li><code>showFitBoundsToggle</code> whether to include a button to toggle between the initial map zoom and the bounds of the data. Default: false</li>
 *  <li><code>useMyLocation</code> whether to include a "Use My Location" button to place a marker on the map at the user's location. Default: true</li>
 *  <li><code>allowSearchLocationByAddress</code> whether to allow the user to search by address to place a marker on the map. Default: true</li>
 *  <li><code>allowSearchRegionByAddress</code> whether to allow the user to search by address to draw a polygon on the map. Default: true</li>
 *  <li><code>geocodeRegionOptions</code> additional configuration options when using the allowSearchRegionByAddress control. Only relevant when allowSearchRegionByAddress = true:</li>
 *      <ul>
 *          <li><code>pointToCircle</code> true to render any point locations returned by the geocode service as circles. Default: true</li>
 *          <li><code>pointRadiusMeters</code> The radius of the circle to use when pointToCircle = true. Units are in meters. Default: 500</li>
 *      </ul>
 *  <li><code>zoomToObject</code> whether to automatically fit the map to the bounds of a new object when added. Default: true</li>
 *  <li><code>draggableMarkers</code> whether to allow point markers to be draggable by default. Default: true</li>
 *  <li><code>wmsFeatureUrl</code> the URL to call to fetch features of a WMS layer (e.g. http://spatial-dev.ala.org.au/geoserver/wms/reflect?). The PID will be appended to this URL. Default: </li>
 *  <li><code>wmsLayerUrl</code> the URL to call to retrieve a WMS layer. The PID will be appended to this URL. Default: </li>
 *  <li><code>sleep</code> True to disable mouse wheel zooming once the mouse has been out of the map for a certain time. Clicking in the map re-enables it. Overrides scrollWheelZoom. Default: true</li>
 *  <li><code>sleepTime</code> Time (milliseconds) until the map 'sleeps' up after the mouse moves away from the map. Only relevant if sleep = true. Default: 750</li>
 *  <li><code>hoverToWake</code> True to wake the map up after the mouse has been held over the map for a certain time (wakeTime). Only relevant if sleep = true. Default: true</li>
 *  <li><code>wakeTime</code> Time (milliseconds) until the map wakes up after mouse over. Only relevant if sleep = true and hoverToWake = true. Default: 750</li>
 *  <li><code>sleepNote</code> True to display text over the map when it is sleeping. Only relevant if sleep = true. Default: false</li>
 *  <li><code>sleepOpacity</code> Opacity of the sleep text. Only relevant if sleep = true and sleepNote = true. Default: 0.7</li>
 *  <li><code>wakeMessage</code> Text to display over the map when it is sleeping. Only relevant if sleep = true and sleepNote = true. Default: 'Click or hover to wake'.</li>
 *  <li><code>trackWindowHeight<code> Map will adjust its height according to the height of browser window when set to true. Default: false. </li>
 *  <li><code>minMapHeight<code> The height of map will not go below this value. It is only active when trackWindowHeight is true. Default: 250. </li>
 * </ul>
 *
 * @class
 * @memberOf ALA
 * @param {String} id Unique id of the map container div. Mandatory.
 * @param {Object} options Configuration options for the map. Optional - sensible defaults will be used if not provided. See the list above.
 */
ALA.Map = function (id, options) {
    var self = this;

    self.DEFAULT_CENTRE = {
        lat: -28,
        lng: 134
    };

    var DEFAULT_ZOOM = 4;
    var SINGLE_POINT_ZOOM = 16;
    var MAX_AUTO_ZOOM = 15;
    var DEFAULT_MAX_ZOOM = 21;
    var DEFAULT_OPACITY = 0.5;
    var DEFAULT_LINE_WEIGHT = 4;
    var DEFAULT_FILL_COLOUR = "#000";
    var DEFAULT_MAP_HEIGHT_BUFFER = 40;

    // There is a bug with Leaflet prior to v1.0 which causes drawing issues with animations enabled.
    // E.g. Calling fitBounds multiple times sometimes causes the drawing of the map to fail, usually leaving some or
    // all of the base tile layer's tiles out. Until that is fixed, we will disable animations.
    // https://github.com/Leaflet/Leaflet/issues/3249
    var ANIMATE = false;

    var DEFAULT_SHAPE_OPTIONS = {
        weight: DEFAULT_LINE_WEIGHT,
        fillOpacity: DEFAULT_OPACITY,
        color: DEFAULT_FILL_COLOUR
    };

    var AVAILABLE_BASE_LAYERS = {
        Minimal: {
            // See https://cartodb.com/location-data-services/basemaps/
            url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
            title: 'Minimal',
            defaultSelected: true,
            defaultInList: true,
            options: {
                subdomains: "abcd",
                attribution: 'Map data &copy; <a target="_blank" rel="noopener noreferrer" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, imagery &copy; <a target="_blank" rel="noopener noreferrer" href="http://cartodb.com/attributions">CartoDB</a>',
                maxZoom: DEFAULT_MAX_ZOOM,
                maxNativeZoom: 21
            }
        },
        WorldImagery: {
            // see https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            title: 'World Imagery',
            defaultSelected: false,
            defaultInList: true,
            options: {
                attribution: '<a target="_blank" rel="noopener noreferrer" href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Tiles from Esri</a> &mdash; Sources: Esri, DigitalGlobe, Earthstar Geographics, CNES/Airbus DS, GeoEye, USDA FSA, USGS, Aerogrid, IGN, IGP, and the GIS User Community',
                maxZoom: DEFAULT_MAX_ZOOM,
                maxNativeZoom: 17
            }
        },
        Detailed: {
            // see https://wiki.openstreetmap.org/wiki/Standard_tile_layer
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            title: 'Detailed',
            defaultSelected: false,
            defaultInList: false,
            options: {
                subdomains: "abc",
                attribution: '&copy; <a target="_blank" rel="noopener noreferrer" href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
                maxZoom: DEFAULT_MAX_ZOOM,
                maxNativeZoom: 18
            }
        },
        Topographic: {
            // see https://www.arcgis.com/home/item.html?id=30e5fe3149c34df1ba922e6f5bbf808f
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
            title: 'Topographic',
            defaultSelected: false,
            defaultInList: false,
            options: {
                attribution: '<a target="_blank" rel="noopener noreferrer" href="https://www.arcgis.com/home/item.html?id=30e5fe3149c34df1ba922e6f5bbf808f">Tiles from Esri</a> &mdash; Sources: Esri, HERE, Garmin, Intermap, INCREMENT P, GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), &copy; OpenStreetMap contributors, GIS User Community',
                maxZoom: DEFAULT_MAX_ZOOM,
                maxNativeZoom: 17
            }
        }
    };

    var DEFAULT_LAYER_CONTROL_OPTIONS = {
        position: "topright"
    };

    var DEFAULT_DRAW_OPTIONS = {
        polyline: false,
        polygon: {
            allowIntersection: false,
            shapeOptions: DEFAULT_SHAPE_OPTIONS
        },
        rectangle: {
            shapeOptions: DEFAULT_SHAPE_OPTIONS
        },
        circle: {
            shapeOptions: DEFAULT_SHAPE_OPTIONS
        },
        circlemarker: false,
        edit: true
    };

    var DEFAULT_EDIT_DRAW_OPTIONS = {
        featureGroup: undefined,
        poly: {
            allowIntersection: false
        }
    };

    var HIDDEN_LAYER = {
        weight: 0,
        fillOpacity: 0
    };

    var VISIBLE_LAYER = {
        weight: DEFAULT_LINE_WEIGHT,
        fillOpacity: DEFAULT_OPACITY,
        color: DEFAULT_FILL_COLOUR
    };

    var DEFAULT_WMS_PROPERTIES = {
        tiled: true,
        format: 'image/png',
        opacity: 0.5,
        transparent: true,
        layers: "ALA:Objects",
        version: "1.1.0",
        srs: "EPSG:900913"
    };

    /**
     * Default Map options
     *
     * @memberOf ALA.Map
     * @var
     */
    var DEFAULT_OPTIONS = {
        center: [self.DEFAULT_CENTRE.lat, self.DEFAULT_CENTRE.lng],
        zoom: DEFAULT_ZOOM,
        maxZoom: DEFAULT_MAX_ZOOM,
        maxAutoZoom: MAX_AUTO_ZOOM,
        defaultLayersControl: true,
        addLayersControlHeading: false,
        scrollWheelZoom: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        },
        drawControl: true,
        singleDraw: true,
        singleMarker: true,
        markerOrShapeNotBoth: true,
        showFitBoundsToggle: false,
        useMyLocation: true,
        allowSearchLocationByAddress: true,
        allowSearchRegionByAddress: true,
        geocodeRegionOptions: {
            pointToCircle: true,
            pointRadiusMeters: 500
        },
        zoomToObject: true,
        worldCopyJump: true,
        draggableMarkers: true,
        showReset: true,
        wmsLayerUrl: null,
        wmsFeatureUrl: null,
        myLocationControlTitle: "Use my location",
        drawOptions: DEFAULT_DRAW_OPTIONS,
        editOptions: DEFAULT_EDIT_DRAW_OPTIONS,
        sleep: true,
        sleepTime: 750,
        wakeTime: 750,
        sleepNote: false,
        hoverToWake: true,
        trackWindowHeight: false,
        minMapHeight: 250,
        autoZIndex: true,
        preserveZIndex: false
    };

    /**
     * Supported Layer options.
     *
     * The following configuration options are available:
     * <ul>
     *     <li><code>markerWithMouseOver</code> - show a marker at the center of the layer, and hide the layer outline until the mouse is moved over the marker. Default: false</li>
     *     <li><code>markerLocation</code> - used with 'markerWithMouseOver' to specify the position of the marker - if not provided, the center of the layer's bounds will be used. Only works with a single feature.</li>
     *     <li><code>popup</code> - text or HTML to display when the layer (or the placeholder marker if markerWithMouseOver = true) is clicked.</li>
     * </ul>
     *
     * @memberOf ALA.Map
     * @var
     */
    var LAYER_OPTIONS = {
        markerWithMouseOver: false,
        markerLocation: undefined,
        popup: undefined
    };

    /**
     * Default options for clustered point markers.
     *
     * See http://leafletjs.com/reference.html#path-options for the options: this object overrides the standard Leaflet
     * options with our default values, where they are different.
     *
     * @memberOf ALA.Map
     * @var
     */
    var DEFAULT_POINT_MARKER_OPTIONS = {};

    if (!id) {
        console.error("[ALA-Map] You must define a unique id for your map.")
    }

    if (_.isUndefined(options)) {
        options = {};
    }
    populateDefaultOptions(options);

    var mapImpl = null;
    var fitToBoundsOfLayer = null;
    var drawControl = null;
    var drawnItems = DEFAULT_EDIT_DRAW_OPTIONS.featureGroup = new L.FeatureGroup();
    var markers = [];
    var subscribers = [];
    var fitToBoundsToggle = options.zoomToObject;
    var layerControl = null;

    /* Keep track of all available overlay layers. */
    var overlayLayersAvailable = [];

    /* Keep track of the selected overlay layers.  */
    var overlayLayersSelected = [];

    /**
     * Destroy the map and clear all related event listeners
     *
     * @memberOf ALA.Map
     * @function destroy
     */
    self.destroy = function () {
        mapImpl.remove();
        fitToBoundsOfLayer = null;
        drawControl = null;
        drawnItems = null;
        markers = [];
        subscribers = [];
    };

    /**
     * Subscribe to all update events on the map.
     *
     * To listen for specific events, use {@link ALA.Map#registerListener} instead.
     *
     * @memberOf ALA.Map
     * @function subscribe
     * @param callback {function} the callback function to be invoked when the map is updated
     * @returns {Object} An object with a 'cancel' method that you can use remove this subscription.
     */
    self.subscribe = function (callback) {
        subscribers.push(callback);
        return {
            cancel: function() {
                self.unsubscribe(callback);
            }
        }
    };

    /**
     * Stop listening to map update events.
     *
     * @memberOf ALA.Map
     * @function unsubscribe
     * @param callback {function} the callback function used to subscribe to events
     */
    self.unsubscribe = function (callback) {
        var index = subscribers.indexOf(callback);
        if (index != -1) {
            subscribers.splice(index,1);
        }
    };

    /**
     * Notify all subscribers of an update to the map
     *
     * @memberOf ALA.Map
     * @function notifyAll
     */
    self.notifyAll = function () {
        subscribers.forEach(function (sub) {
            sub();
        });
    };

    /**
     * Adds a listener for the specified event
     *
     * @memberOf ALA.Map
     * @function registerListener
     * @param eventName {String} the Leaflet event to listen to. Mandatory.
     * @param callback {function} The function to invoke when the event occurs. Mandatory.
     */
    self.registerListener = function (eventName, callback) {
        if (!eventName || !callback) {
            console.error("[ALA-Map] You must specify the eventName and callback when registering a listener");
        }

        mapImpl.on(eventName, callback);
    };

    /**
     * Removes a listener for the specified event. Leaflet identifies listeners by references, so the original
     * callback needs to be provided in order to find the listener to remove.
     *
     * @memberOf ALA.Map
     * @function removeListener
     * @param eventName {String} the Leaflet event being listened to. Mandatory.
     * @param callback {function} The function to invoke when the event occurs. Mandatory.
     */
    self.removeListener = function (eventName, callback) {
        mapImpl.off(eventName, callback)
    };

    /**
     * Retrieves the standard GeoJSON representation of all features that have been drawn on the map.
     *
     * Note that Circle objects are not supported by GeoJSON. Therefore, they are represented as Points in the resulting
     * geometry. A workaround has been added to include 'point_type' = 'circle' and 'radius' properties in the feature's
     * property object (this is still valid GeoJSON).
     *
     * @memberOf ALA.Map
     * @function getGeoJSON
     * @return {GeoJSON} Standard GeoJSON representation of the map's drawn features
     */
    self.getGeoJSON = function () {
        return drawnItems.toGeoJSON();
    };

    /**
     * Populate the map with the provided GeoJSON data.
     *
     * If a Point feature's properties object contains "point_type: 'Circle' and "radius: {m}", then the point will be
     * rendered as a circle.
     *
     * If the properties object of a feature includes a 'pid', then a new WMS layer will be added to the map instead of
     * a polygon layer.
     *
     * See {@link LAYER_OPTIONS} for details of supported options.
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function setGeoJSON
     * @param geoJSON {GeoJSON} Standard GeoJSON metadata for map features. This can be a JSON string, or a GeoJSON object.
     * @param layerOptions {Object} Configuration options for the layer. See {@link LAYER_OPTIONS} for details of supported options. Optional.
     */
    self.setGeoJSON = function (geoJSON, layerOptions) {
        if (typeof geoJSON === 'string') {
            geoJSON = JSON.parse(geoJSON);
        }

        var layerCreatedByGeoJSON;

        L.geoJson(geoJSON, {
            pointToLayer: pointToLayerCircleSupport,
            onEachFeature: function (feature, layer) {
                wmsOptions = {};
                //Create a popup content
                if(feature.properties && feature.properties.popupContent)
                    layer.bindPopup(feature.properties.popupContent);

                if (feature.properties && feature.properties.pid) {
                    if (feature.geometry.type == ALA.MapConstants.DRAW_TYPE.POINT_TYPE){
                        wmsOptions.layers = "ALA:Points"
                        wmsOptions.opacity = 1.0
                      }
                    layer = createWmsLayer(feature.properties.pid, wmsOptions);
                }

                if (options.singleDraw) {
                    drawnItems.clearLayers();
                }
                if (options.markerOrShapeNotBoth) {
                    clearMarkers();
                }

                drawnItems.addLayer(layer);
                if (layer.bringToFront) {
                    layer.bringToFront();
                }

                applyLayerOptions(layer, layerOptions);
                layerCreatedByGeoJSON = layer;
            },
            style: DEFAULT_SHAPE_OPTIONS
        });


        if (options.zoomToObject) {
            self.fitBounds();
        }

        self.notifyAll();

        return layerCreatedByGeoJSON;
    };

    /**
     * Retrieve the unique id for this map
     *
     * @memberOf ALA.Map
     * @function getMapId
     * @returns {String} unique id of the map
     */
    self.getMapId = function () {
        return id;
    };

    /**
     * Retrieve the underlying map implementation
     *
     * @memberOf ALA.Map
     * @function getMapImpl
     * @returns {Object} Leaflet Map object
     */
    self.getMapImpl = function () {
        return mapImpl;
    };

    /**
     * Removes all custom layers, reverts to the initial base layer, resets the zoom level to the default and re-centres
     * the map.
     *
     * If {@link fitToBoundsOf} has been called previously, then resetMap will fit the map to the previously supplied
     * bounds. To reset to the default map centre & zoom, call {@link clearBoundLimits} before resetMap.
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function resetMap
     */
    self.resetMap = function () {
        drawnItems.clearLayers();
        markers = [];

        if (!_.isUndefined(fitToBoundsOfLayer) && fitToBoundsOfLayer != null) {
            self.fitToBoundsOf(fitToBoundsOfLayer);
        } else {
            mapImpl.setZoom(DEFAULT_ZOOM, {animate: ANIMATE});
            mapImpl.panTo(self.DEFAULT_CENTRE, {animate: ANIMATE});
        }

        self.notifyAll();
    };

    /**
     * Remove all drawn layers from the map. This does not remove markers: see {@link self#clearMarkers}.
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function clearLayers
     */
    self.clearLayers = function () {
        drawnItems.eachLayer(function (layer) {
            if (markers.indexOf(layer) == -1) {
                drawnItems.removeLayer(layer);
            }
        });

        self.fitBounds();

        self.notifyAll();
    };

    /**
     * Removes the specified layer from the map.
     *
     * @memberOf ALA.Map
     * @function removeLayer
     * @param layer {Object} the Leaflet Layer object to remove
     */
    self.removeLayer = function (layer) {
        drawnItems.removeLayer(layer);
        self.fitBounds();

        self.notifyAll();
    };

    /**
     * Remove all markers from the map. This does not remove other layers or shapes: see {@link self#clearLayers}.
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function clearMarkers
     */
    self.clearMarkers = function () {
        clearMarkers();

        self.notifyAll();
    };

    /**
     * Get the lat/lng coordinates of the centre of the map view
     *
     * @memberOf ALA.Map
     * @function getCentre
     * @returns {Object} lat/lng object
     */
    self.getCentre = function () {
        var centre = mapImpl.getCenter();
        return {lat: centre.lat, lng: centre.lng};
    };

    /**
     * Adds a marker at the specified point.
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function addMarker
     * @param lat {Number} Latitude for the marker. Mandatory.
     * @param lng {Number} Longitude for the marker. Mandatory.
     * @param popup {String} Text or HTML to display in a popup when the marker is clicked. Optional.
     * @param markerOptions {Object} Object containing configuration items to override the defaults. Optional,
     * @returns {L.Marker} The L.marker object
     */
    self.addMarker = function (lat, lng, popup, markerOptions) {
        if (_.isUndefined(markerOptions)) {
            markerOptions = {};
        }
        markerOptions.draggable = options.draggableMarkers;

        var marker = L.marker([lat, lng], markerOptions);

        addMarker(marker, true);

        if (popup) {
            marker.bindPopup(popup);
        }

        return marker;
    };

    /**
     * Adds a layer of clustered L.circleMarker to the map. Clustered points are treated the same as other layers/shapes:
     * i.e. they are NOT considered to be 'markers' like those added with the {@link #addMarker} function.
     *
     * See http://leafletjs.com/reference.html#path-options for the possible options.
     *
     * Each point object in the points array must have the following structure:
     * <ul>
     *     <li><code>lat</code> - the latitude for the point. Mandatory.</li>
     *     <li><code>lng</code> - the longitude for the point. Mandatory.</li>
     *     <li><code>popup</code> - Text or HTML to be used as the popup when the marker is clicked. Optional.</li>
     *     <li><code>options</code> - options object to override specified options for the individual point. Optional.</li>
     * </ul>
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function addClusteredPoints
     * @param points {Array} Mandatory array of objects with mandatory properties 'lat' and 'lng', and optionally an 'options' object.
     * @param pointOptions {Object} Optional object containing configuration options to be applied to ALL points.
     */
    self.addClusteredPoints = function (points, pointOptions) {
        self.startLoading();

        if (options.singleDraw) {
            drawnItems.clearLayers();
        }
        if (options.markerOrShapeNotBoth) {
            clearMarkers();
        }

        var groupOptions = {
            chunkedLoading: true
        };
        var cluster = L.markerClusterGroup(groupOptions);

        _.defaults(pointOptions, DEFAULT_POINT_MARKER_OPTIONS);

        var layers = [];
        points.forEach(function (point) {
            var newPointOptions = _.clone(pointOptions);
            if (point.options) {
                _.defaults(newPointOptions, point.options);
            }

            var layer = L.circleMarker(new L.LatLng(point.lat, point.lng), newPointOptions);
            if (point.popup) {
                layer.bindPopup(point.popup);
            }

            layers.push(layer);
        });

        cluster.addLayers(layers);

        addLayer(cluster, true);
    };

    /**
     * Adds a layer of points or icons to map. Icons gives the flexibility of adding shape to map.
     *
     * Each point object in the points array must have the following structure:
     * <ul>
     *     <li><code>lat</code> - the latitude for the point. Mandatory.</li>
     *     <li><code>lng</code> - the longitude for the point. Mandatory.</li>
     *     <li><code>type</code> - supported values 'point' or 'icon'. point draws a circle and icon renders the provided image. Default 'point'. </li>
     *     <li><code>popup</code> - Text or HTML to be used as the popup when the marker is clicked. Optional.</li>
     *     <li><code>options</code> - options object to override specified options for the individual point. Optional.</li>
     * </ul>
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function addPointsOrIcons
     * @param points {Array} Mandatory array of objects with mandatory properties 'lat' and 'lng', and optionally an 'options' object.
     * @param pointOptions {Object} Optional object containing configuration options to be applied to ALL points.
     * @param iconUrl {String} Optional image URL
     * @param iconOptions {Object} Optional object describing the icon metadata like size, anchor point, popup location.
     */
    self.addPointsOrIcons = function (points, pointOptions, iconUrl, iconOptions) {
        self.startLoading();

        if (options.singleDraw) {
            drawnItems.clearLayers();
        }
        if (options.markerOrShapeNotBoth) {
            clearMarkers();
        }

        _.defaults(pointOptions, DEFAULT_POINT_MARKER_OPTIONS);

        var icon = ALA.MapUtils.createIcon(iconUrl, iconOptions);
        points.forEach(function (point) {
            var newPointOptions = _.clone(pointOptions);
            if (point.options) {
                _.defaults(newPointOptions, point.options);
            }

            var layer;
            switch (point.type){
                case 'icon':
                    newPointOptions.icon = icon;
                    layer = L.marker([point.lat, point.lng], newPointOptions);
                    break;
                case 'circle':
                default:
                    layer = L.circleMarker(new L.LatLng(point.lat, point.lng), newPointOptions);
                    break;
            }

            if (point.popup) {
                layer.bindPopup(point.popup);
            }

            drawnItems.addLayer(layer)
        });
    };

    /**
     * Adds a marker at the user's current location.
     * Will notify all subscribers.
     *
     * Fire a 'SearchEventFired' for site creation
     * @memberOf ALA.Map
     * @function markMyLocation
     */
    self.markMyLocation = function () {
        self.startLoading();

        mapImpl.locate({setView: true, enableHighAccuracy: true});
        mapImpl.on("locationfound", function (locationEvent) {
            self.addMarker(locationEvent.latlng.lat, locationEvent.latlng.lng, null);
            mapImpl.off("locationfound", arguments.callee);
            mapImpl.fire("searchEventFired");
            self.finishLoading();
        });

        mapImpl.on("locationerror", function (event) {
            mapImpl.off("locationerror", arguments.callee);
            console.log("[ALA-Map] location lookup failed - " + event.message);
            console.log("[ALA-Map] location lookup error code - " + event.code);
            alert("Location lookup failed for the following reason - " + event.message);
            self.finishLoading();
        });
    };

    /**
     * Add a new layer to the map.
     *
     * Will notify all subscribers.
     *
     * @memberOf ALA.Map
     * @function addLayer
     * @param {Object} layer The Leaflet ILayer to add
     * @param layerOptions {Object} Configuration options for the layer. See {@link LAYER_OPTIONS} for details of supported options. Optional.
     */
    self.addLayer = function (layer, layerOptions) {
        if (options.singleDraw) {
            drawnItems.clearLayers();
        }
        if (options.markerOrShapeNotBoth) {
            clearMarkers();
        }

        addLayer(layer, true);

        applyLayerOptions(layer, layerOptions);
    };

    /**
     * Utility method to add a WMS layer to the map.
     *
     * Triggers events draw:drawstart and draw:created, and will notify all subscribers
     *
     * @memberOf ALA.Map
     * @function addWmsLayer
     * @param pid {String} the PID of the region to be displayed in the WMS layer - set as undefined if you do not need to use an existing region.
     * @param layerOptions {Object} Configuration options for the layer. If pid is undefined, then the layerOptions object must contain the required WMS configuration parameters. See {@link LAYER_OPTIONS} for details of additional supported options. Optional.
     * @returns {L.TileLayer.SmartWMS} the L.TileLayer.WMS object
     */
    self.addWmsLayer = function (pid, layerOptions) {
        self.startLoading();

        var layer = createWmsLayer(pid, layerOptions);

        if (options.singleDraw) {
            drawnItems.clearLayers();
        }
        if (options.markerOrShapeNotBoth) {
            clearMarkers();
        }

        addLayer(layer, false);
        layer.bringToFront(); // make sure the new layer sits on top of the other tile layers (like the base layer)

        applyLayerOptions(layer, layerOptions);

        return layer;
    };

    /**
     * Add a layer to the map as an overlay layer.
     *
     * @memberOf ALA.Map
     * @function addOverlayLayer
     * @param {L.Class} layer The tile layer or other type of layer to add as an overlay layer.
     * @param {string} name The name text to show for this layer.
     * @param {boolean} isSelected Whether the added overlay layer should start selected, and therefore visible, or not.
     */
    self.addOverlayLayer = function (layer, name, isSelected) {
        overlayLayerAdd(layer, name, isSelected);
    };

    /**
     * Remove an overlay layer from the layers control.
     * @param {L.Class} layer The layer to remove.
     */
    self.removeOverlayLayer = function(layer) {
        overlayLayerRemove(layer);
    };

    /**
     * Get the overlay layers.
     *
     * @memberOf ALA.Map
     * @function getOverlayLayers
     * @param {string} filter Which layers to include: 'all': all layers; 'selected': only selected layers. Default 'all'.
     * @return
     */
    self.getOverlayLayers = function (filter) {
        filter = filter || 'all';
        switch (filter) {
            case 'selected':
                return overlayLayersSelected;
            case 'all':
            default:
                return overlayLayersAvailable;
        }
    };

    /**
     * Get the most recently selected overlay layer.
     *
     * @memberOf ALA.Map
     * @function getTopSelectedOverlayLayer
     * @return {null|L.Class} The most recently selected layer or null if no layers are selected.
     */
    self.getTopSelectedOverlayLayer = function () {
        if (overlayLayersSelected.length > 0) {
            return overlayLayersSelected[overlayLayersSelected.length - 1];
        }
        return null;
    };

    /**
     * Retrieve the current bounds for the map, if possible.
     *
     * @memberOf ALA.Map
     * @function getBounds
     * @returns {Object} Leaflet Bounds object, or null if the bounds cannot be determined
     */
    self.getBounds = function () {
        var bounds = null;

        if (self.countFeatures() > 0) {
            var hasGetBounds = true;

            drawnItems.eachLayer(function (layer) {
                hasGetBounds |= _.isUndefined(layer.getBounds);
            });

            if (hasGetBounds) {
                bounds = drawnItems.getBounds();
            }
        }

        return bounds;
    };

    /**
     * Zoom to the specified level and centre the map at the specified coordinates
     *
     * @memberOf ALA.Map
     * @function zoom
     * @param {Number} zoom The zoom level
     * @param {Object} centre The coordinates to centre the map on. Must be an object with 'lat' and 'lng' attributes. Defaults to the map's default centre if not provided.
     */
    self.zoom = function (zoom, centre) {
        mapImpl.setZoom(zoom, {animate: ANIMATE});
        mapImpl.panTo(centre || self.DEFAULT_CENTRE, {animate: ANIMATE});
    };

    /**
     * Zoom and centre the map to fit the bounds of the current feature(s). If there are no features, then the map will
     * be set to the default zoom and centre.
     *
     * @memberOf ALA.Map
     * @function fitBounds
     */
    self.fitBounds = function () {
        self.startLoading();
        if (self.countFeatures() > 0) {
            var hasGetBounds = true;

            drawnItems.eachLayer(function (layer) {
                hasGetBounds |= _.isUndefined(layer.getBounds);
            });

            if (hasGetBounds) {
                mapImpl.fitBounds(drawnItems.getBounds(), {maxZoom: options.maxAutoZoom, animate: ANIMATE});
            } else {
                // cannot determine the bounds from the layers, set the map centre and zoom level to the defaults
                mapImpl.setZoom(DEFAULT_ZOOM, {animate: ANIMATE});
                mapImpl.panTo(self.DEFAULT_CENTRE, {animate: ANIMATE});
            }
        } else {
            mapImpl.setZoom(DEFAULT_ZOOM, {animate: ANIMATE});
            mapImpl.panTo(self.DEFAULT_CENTRE, {animate: ANIMATE});
        }
        self.finishLoading();
    };

    /**
     * Zoom and centre the map to fit the bounds of the provided GeoJSON object, but do NOT draw the object.
     *
     * Subsequent calls to Reset Map will automatically fit the map to the bounds of this object.
     *
     * The difference between this and {@link setMaxBounds} is that setMaxBounds will prevent the user from panning
     * outside the provided bounds, whereas this method will allow that.
     *
     * @memberOf ALA.Map
     * @function fitToBoundsOf
     * @param {Object} geoJSON Valid GeoJSON object to fit the map to
     */
    self.fitToBoundsOf = function (geoJSON) {
        if (typeof geoJSON === 'string') {
            geoJSON = JSON.parse(geoJSON);
        }

        fitToBoundsOfLayer = geoJSON;

        var geoJsonLayer = new L.FeatureGroup();

        L.geoJson(geoJSON, {
            pointToLayer: pointToLayerCircleSupport,
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.pid) {
                    var wmsOptions = {
                        pid: feature.properties.pid,
                        viewparams: "s:" + feature.properties.pid,
                        wmsFeatureUrl: options.wmsFeatureUrl + feature.properties.pid,
                        callback: function () {
                            if (geoJsonLayer.getBounds && !_.isUndefined(geoJsonLayer.getBounds())) {
                                mapImpl.fitBounds(geoJsonLayer.getBounds(), {maxZoom: options.maxAutoZoom, animate: ANIMATE});
                            }
                        }
                    };
                    _.defaults(wmsOptions, DEFAULT_WMS_PROPERTIES);
                    layer = L.tileLayer.smartWms(options.wmsLayerUrl, wmsOptions);
                    layer.retrieveLayer();
                }

                geoJsonLayer.addLayer(layer);
            }
        });

        // WMS layers may not have the bounds, or the fully populated bounds, until the layer is retrieved from the server.
        // There is a callback above which fits the bounds for WMS layers after they are populated.
        if (geoJsonLayer.getBounds && !_.isUndefined(geoJsonLayer.getBounds()) && !_.isUndefined(geoJsonLayer.getBounds().getNorthEast())) {
            mapImpl.fitBounds(geoJsonLayer.getBounds(), {maxZoom: options.maxAutoZoom, animate: ANIMATE});
        }
    };

    /**
     * Zoom and centre the map to fit the provided bounds, and prevent the user from moving outside that boundary.
     *
     * Subsequent calls to Reset Map will automatically fit the map to the bounds of this object.
     *
     * The difference between this and {@link fitToBoundsOf} is that fitToBoundsOf will allow the user to pan outside
     * the provided bounds, whereas this method will not.
     *
     * @memberOf ALA.Map
     * @function setMaxBounds
     * @param {LatLngBounds} latLngBounds The Leaflet LatLngBounds object to restrict the map to
     */
    self.setMaxBounds = function (latLngBounds) {
        mapImpl.setMaxBounds(latLngBounds);
    };

    /**
     * Clears any limits on the map bounds. This will remove the max bounds (from {@link setMaxBounds}) and the display
     * bounds (from {@link fitToBoundsOf}) if they exist. The map will be reset to the bounds of the current content
     * (as per {@link fitBounds}).
     *
     * @memberOf ALA.Map
     * @function clearBoundLimits
     */
    self.clearBoundLimits = function () {
        if (!_.isUndefined(fitToBoundsOfLayer) && fitToBoundsOfLayer != null) {
            fitToBoundsOfLayer = null;
        }

        self.fitBounds();
    };

    /**
     * Invalidates the size of the map to trigger a re-draw, then fits the viewport to the current bounds.
     *
     * @memberOf ALA.Map
     * @function redraw
     */
    self.redraw = function () {
        mapImpl.invalidateSize();

        self.fitBounds();
    };

    /**
     * Adds a control widget to the map
     *
     * @memberOf ALA.Map
     * @function addControl
     * @param {L.Control} control The Leaflet Control to add
     */
    self.addControl = function (control) {
        mapImpl.addControl(control);
    };

    /**
     * Adds a button to the map..
     *
     * E.g.
     * <code>
     *     addButton('fa fa-map-marker', function (button, map) { ... }
     * </code>
     *
     * @memberOf ALA.Map
     * @function addButton
     * @param {String} style The CSS style, or a HTML string with a span or image etc, for the button
     * @param {function} closure A function pointer for the function to be invoked. The first parameter of the function will be the
     * leaflet button. The second parameter will be the leaflet map. I.e.
     * @param {String} position Leaflet Position value. Defaults to 'topleft'
     */
    self.addButton = function (style, closure, position) {
        var button = L.easyButton(style, closure).addTo(mapImpl);
        if (!_.isUndefined(position)) {
            button.setPosition(position);
        }
    };

    /**
     * Retrieve all leaflet markers on the map
     *
     * @memberOf ALA.Map
     * @function getAllMarkers
     * @returns {Array} of all L.Markers on the map
     */
    self.getAllMarkers = function () {
        return _.clone(markers);
    };

    /**
     * Retrieve an array of objects of format [lat: x, lng: y] containing the coordinates of all markers on the map
     *
     * @memberOf ALA.Map
     * @function getMarkerLocations
     * @returns {Array} [lat: x, lng: y] of all markers
     */
    self.getMarkerLocations = function () {
        var locations = [];

        markers.forEach(function (marker) {
            locations.push({lat: marker.getLatLng().lat, lng: marker.getLatLng().lng});
        });

        return locations;
    };

    /**
     * Retrieve a count of all features (shapes, layers, markers, etc) on the map
     *
     * @memberOf ALA.Map
     * @function countFeatures
     * @return {Integer} count of all features (shapes, layers, markers, etc) on the map
     */
    self.countFeatures = function () {
        var count = 0;
        drawnItems && drawnItems.eachLayer(function () {
            count++;
        });

        return count;
    };

    /**
     * Display a loading spinner on the map.
     *
     * Note: This is done automatically for any direct changes on the map.
     *
     * @memberOf ALA.Map
     * @function startLoading
     */
    self.startLoading = function () {
        mapImpl.fire("dataloading");
    };

    /**
     * Stop the loading spinner on the map.
     *
     * Note: This is done automatically for any direct changes on the map.
     *
     * @memberOf ALA.Map
     * @function finishLoading
     */
    self.finishLoading = function () {
        mapImpl.fire("dataload");
    };

    /**
     * Toggle the view between fitting the bounds of the data and the initial centre and zoom
     *
     * @memberOf ALA.Map
     * @function toggleFitBounds
     */
    self.toggleFitBounds = function () {
        fitToBoundsToggle = !fitToBoundsToggle;
        var button = $(".ala-map-fit-bounds");
        if (fitToBoundsToggle) {
            self.fitBounds();
            button.removeClass("fa-search-plus");
            button.addClass("fa-search-minus");
        } else {
            self.zoom(options.zoom, options.centre);
            button.removeClass("fa-search-minus");
            button.addClass("fa-search-plus");
        }
    };

    /**
     * Add a layer selection control to the map. If options#defaultLayersControl = false, then this function can be used
     * to place the layers control in a position other than the default (top right).
     *
     * If the layer control has already been added, then the baselayers and overlays will be added to the existing control.
     * The controlOptions will be ignored.
     *
     * See http://leafletjs.com/reference.html#control-layers for details.
     *
     * @memberOf ALA.Map
     * @function addLayersControl
     * @param {Object} baseLayers Collection of base layers with names to add to the control
     * @param {Object} overlays Collection of overlay layers with names to add to the control
     * @param {Object} controlOptions config options, including overlayLayersSelectedByDefault: List of String
     * @return {L.Control.Layers} added layer control
     */
    self.addLayersControl = function (baseLayers, overlays, controlOptions) {
        // get overlay layers to select by default
        var overlayLayersSelectedByDefault = [];
        if (controlOptions && controlOptions.overlayLayersSelectedByDefault) {
            overlayLayersSelectedByDefault = controlOptions.overlayLayersSelectedByDefault;
            delete controlOptions.overlayLayersSelectedByDefault;
        }

        var baseLayersToAdd = baseLayers || options.otherLayers || {};
        var overlayLayersToAdd = overlays || {};

        var baseLayerCount = Object.keys(baseLayersToAdd).length;
        var overlayLayerCount = Object.keys(overlayLayersToAdd).length;

        // create control with layers or update layers
        if (layerControl) {
            if (baseLayers) {
                for (var baseLayerName in baseLayers) {
                    layerControl.addBaseLayer(baseLayers[baseLayerName], baseLayerName);
                }
            }

            if (overlays) {
                for (var existingControlOverlayName in overlays) {
                    var existingControlOverlayLayer = overlays[existingControlOverlayName];
                    var existingControlOverlaySelected = overlayLayersSelectedByDefault
                        .indexOf(existingControlOverlayName) > -1;
                    overlayLayerAdd(
                        existingControlOverlayLayer,
                        existingControlOverlayName,
                        existingControlOverlaySelected);
                }
            }

            console.log("[ALA-Map] Updated layer control to add " + baseLayerCount + " base layers and " + overlayLayerCount + " overlay layers.");

        } else {
            _.defaults(controlOptions, DEFAULT_LAYER_CONTROL_OPTIONS);
            layerControl = L.control.layers(baseLayersToAdd, overlayLayersToAdd, controlOptions);
            layerControl.addTo(mapImpl);

            // always display the loading indicator below the layer control
            addLoadingControl();

            // add the overlays to the list of overlays
            for (var newControlOverlayName in overlays) {
                var newControlOverlayLayer = overlays[newControlOverlayName];
                var newControlOverlaySelected = overlayLayersSelectedByDefault.indexOf(newControlOverlayName) > -1;
                overlayLayerAdd(
                    newControlOverlayLayer,
                    newControlOverlayName,
                    newControlOverlaySelected);
            }

            console.log("[ALA-Map] Created layer control with " + baseLayerCount + " base layers and " + overlayLayerCount + " overlay layers.");
        }

        if (options.addLayersControlHeading)
            addBaseLayerAndOverlayHeading('#' + id);

        return layerControl;
    };

    // ----------------------
    // Private functions
    // ----------------------

    // Main initialiser
    function initialiseMap() {
        var enableDrawing = options.drawControl;

        options.drawControl = false;

        mapImpl = L.map(id, options);

        mapImpl.addLayer(drawnItems);

        addCoordinates();

        L.Icon.Default.imagePath = getLeafletImageLocation();

        mapImpl.addLayer(options.baseLayer);
        if (options.defaultLayersControl) {
            self.addLayersControl(options.otherLayers, options.overlays, {overlayLayersSelectedByDefault: options.overlayLayersSelectedByDefault, autoZIndex: options.autoZIndex});
        }


        if (options.showFitBoundsToggle) {
            var css = "ala-map-fit-bounds fa " + (options.zoomToObject ? "fa-search-minus" : "fa-search-plus");
            self.addButton("<span class='" + css + "' title='Toggle between the full map and the bounds of the data'></span>", self.toggleFitBounds, "topleft");
        }

        if (options.useMyLocation) {
            var title = options.myLocationControlTitle || "Use my location";
            self.addButton("<span class='ala-map-my-location fa fa-location-arrow' title='" + title + "'></span>", self.markMyLocation, "topleft");
        }

        if (options.allowSearchLocationByAddress) {
            addGeocodeControl(ALA.MapConstants.DRAW_TYPE.POINT_TYPE);
        }

        if (options.allowSearchRegionByAddress) {
            addGeocodeControl(ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE);
        }

        if (enableDrawing) {
            initDrawingControls(options);
        }

        if(options.trackWindowHeight) {
            addWindowResizeListener();
            adjustMapContainerHeight();
        }

        if (options.showReset) {
            self.addButton("<span class='ala-map-reset fa fa-refresh reset-map' title='Reset map'></span>", self.resetMap, "bottomright");
        }

        // If the map container is not visible, add a listener to trigger a redraw once it becomes visible.
        // This avoids problems with the map viewport being initialised to an incorrect size because Leaflet could not
        // determine the size of the container.
        var container = $("#" + id);
        if (!container.is(":visible")) {
            container.onImpression({
                callback: self.redraw
            });
        }

        // make sure the base layers never sit on top of other layers when the base layer is changed
        mapImpl.on('baselayerchange', function (event) {
            currentBaseLayer = event.layer;

            if (event.layer.setZIndex) {
                event.layer.setZIndex(-1);
            }
        });

        // when an overlay layer is selected, bring it to the front and mark it as selected
        mapImpl.on('overlayadd', function (e) {
            if (e && e.layer) {
                overlayLayerSelect(e.layer);
            }
        });

        // when an overlay layer is de-selected, remove selected marker
        mapImpl.on('overlayremove', function (e) {
            if (e && e.layer) {
                overlayLayerDeselect(e.layer);
            }
        });
    }

    /**
     * Populate any missing configuration items with the default values.
     * @param currentOptions
     */
    function populateDefaultOptions(currentOptions) {
        _.defaults(currentOptions, DEFAULT_OPTIONS);

        populateDefaultBaseLayerOptions(currentOptions);

        console.log("[ALA-Map] Default options have been set.");
    }

    /**
     * Sets up map base layers - options.baseLayer specifies the default and options.otherLayers specifies the available base layers.
     * If baseLayer is not set, it will be set to the default base layer.
     * If otherLayers is not set, it will be set to the default list, with the default base layer included if it is one of the pre-defined base layers.
     * If otherLayers is provided, the layer set as baseLayer must be included in the otherLayers object.
     *
     * @param currentOptions
     */
    function populateDefaultBaseLayerOptions(currentOptions){
        var selectedBaseLayerName = '';

        // get the name and object for the default selected base layer
        var defaultBaseLayerName = '';
        var defaultBaseLayerObject = null;
        for (var availableDefaultLayerName in AVAILABLE_BASE_LAYERS) {
            var availableDefaultLayerData = AVAILABLE_BASE_LAYERS[availableDefaultLayerName];

            if (availableDefaultLayerData.defaultSelected) {
                defaultBaseLayerName = availableDefaultLayerName;
                defaultBaseLayerObject = L.tileLayer(availableDefaultLayerData.url, availableDefaultLayerData.options);
                break;
            }
        }
        console.log("[ALA-Map] Found default base layer from settings '" + defaultBaseLayerName + "'.");

        // if options.baseLayer is not set, set to default selected base layer object
        if (_.isUndefined(currentOptions.baseLayer)) {
            currentOptions.baseLayer = defaultBaseLayerObject;
            selectedBaseLayerName = defaultBaseLayerName;
            console.log("[ALA-Map] No default base layer specified, set default base layer '" + selectedBaseLayerName + "'.");
        }

        // if options.baseLayer is a string, set to matching built-in base layer object
        if (_.isString(currentOptions.baseLayer)) {
            for (var availableStringLayerName in AVAILABLE_BASE_LAYERS) {
                var availableStringLayerData = AVAILABLE_BASE_LAYERS[availableStringLayerName];
                if (currentOptions.baseLayer.replace(' ', '').toUpperCase() === defaultBaseLayerName.replace(' ', '').toUpperCase()) {
                    currentOptions.baseLayer = defaultBaseLayerObject;
                    selectedBaseLayerName = defaultBaseLayerName;
                    console.log("[ALA-Map] Set default base layer from specified string '" + selectedBaseLayerName + "'.");
                    break;
                } else if (
                    availableStringLayerName.toString().replace(' ', '').toUpperCase() ===
                    currentOptions.baseLayer.replace(' ', '').toUpperCase() ||
                    availableStringLayerData.title.replace(' ', '').toUpperCase() ===
                    currentOptions.baseLayer.replace(' ', '').toUpperCase()) {

                    currentOptions.baseLayer = L.tileLayer(availableStringLayerData.url, availableStringLayerData.options);
                    selectedBaseLayerName = availableStringLayerName;
                    console.log("[ALA-Map] Set default base layer from specified string matching title or id '" + selectedBaseLayerName + "'.");
                    break;
                }
            }

            if (_.isString(currentOptions.baseLayer)) {
                console.warn("[ALA-Map] Unrecognised base layer name: '" + currentOptions.baseLayer + "', " +
                    "supported base layers are '" + Object.keys(AVAILABLE_BASE_LAYERS).sort().join("', '") + "'. " +
                    "Using default base layer '" + defaultBaseLayerName + "'.");
                currentOptions.baseLayer = defaultBaseLayerObject;
                selectedBaseLayerName = defaultBaseLayerName;
            }
        }

        // if options.baseLayer is an object, assume it is a Layer
        if(!_.isObject(currentOptions.baseLayer)){
            // anything else for options.baseLayer is an error
            throw new Error("[ALA-Map] Unexpected value for options.baseLayer: '" + typeof currentOptions.baseLayer + "' - '" + currentOptions.baseLayer + "'.")
        }

        // if options.otherLayers is not set, set to default base layers (including options.baseLayer)
        if (_.isNull(currentOptions.otherLayers) || _.isUndefined(currentOptions.otherLayers)) {
            currentOptions.otherLayers = {};
            for (var availableOtherLayerName in AVAILABLE_BASE_LAYERS) {
                var availableOtherLayerData = AVAILABLE_BASE_LAYERS[availableOtherLayerName];
                if (availableOtherLayerName.replace(' ', '').toUpperCase() === selectedBaseLayerName.replace(' ', '').toUpperCase()) {
                    currentOptions.otherLayers[availableOtherLayerData.title] = currentOptions.baseLayer;
                    console.log("[ALA-Map] Added base layer to collection because it matched default base layer name '" + availableOtherLayerData.title + "'.");
                } else if (availableOtherLayerData.url === currentOptions.baseLayer._url) {
                    currentOptions.otherLayers[availableOtherLayerData.title] = currentOptions.baseLayer;
                    console.log("[ALA-Map] Added base layer to collection because it matched default base layer url '" + availableOtherLayerData.title + "'.");
                } else if (availableOtherLayerData.defaultInList && currentOptions.defaultLayersControl) {
                    currentOptions.otherLayers[availableOtherLayerData.title] = L.tileLayer(availableOtherLayerData.url, availableOtherLayerData.options);
                    console.log("[ALA-Map] Added base layer to collection because defaultLayersControl is true and settings say add by default '" + availableOtherLayerData.title + "'.");
                }
            }
        }

        // if options.otherLayers is set, it must be an object.
        if(!_.isNull(currentOptions.otherLayers) && !_.isUndefined(currentOptions.otherLayers) && !_.isObject(currentOptions.otherLayers)){
            throw new Error("[ALA-Map] Unexpected value for options.otherLayers: '" + typeof currentOptions.otherLayers + "' - '" + currentOptions.otherLayers + "'.")
        }

        // For each property of the object,
        // - if the property is an object, assume it is a Layer.
        // - if the property is a string, set to the matching built-in layer.
        // The options.baseLayer object must be one of the property values, it is an error if not.
        for (var optionsOtherLayerKey in currentOptions.otherLayers) {
            var optionsOtherLayerValue = currentOptions.otherLayers[optionsOtherLayerKey];
            if(_.isString(optionsOtherLayerValue)){
                var optionsOtherLayerData = AVAILABLE_BASE_LAYERS[optionsOtherLayerValue];
                if (optionsOtherLayerKey.replace(' ', '').toUpperCase() === selectedBaseLayerName.replace(' ', '').toUpperCase()) {
                    currentOptions.otherLayers[optionsOtherLayerKey] = currentOptions.baseLayer;
                    console.log("[ALA-Map] Added named base layer to collection because it matched default base layer name '" + optionsOtherLayerKey + "'.");
                } else if (optionsOtherLayerData.url === currentOptions.baseLayer._url) {
                    currentOptions.otherLayers[optionsOtherLayerKey] = currentOptions.baseLayer;
                    console.log("[ALA-Map] Added named base layer to collection because it matched default base layer url '" + optionsOtherLayerKey + "'.");
                } else {
                    currentOptions.otherLayers[optionsOtherLayerKey] = L.tileLayer(optionsOtherLayerData.url, optionsOtherLayerData.options);
                    console.log("[ALA-Map] Added base layer matching string in otherLayers '" + optionsOtherLayerKey + "'.");
                }
            } else if(!_.isObject(optionsOtherLayerValue)){
                throw new Error("[ALA-Map] Unexpected value for options.otherLayers['" + optionsOtherLayerKey + "']: '" + typeof optionsOtherLayerValue + "' - '" + optionsOtherLayerValue + "'.")
            }
        }

        console.log("[ALA-Map] Populated defaults for options.baseLayer with url '" + (currentOptions.baseLayer ? currentOptions.baseLayer._url : '') + "'" +
            " and options.otherLayers '" + (currentOptions.otherLayers ? Object.keys(currentOptions.otherLayers).sort().join(', ') : '') + "'.");
    }

    /**
     * Initialise the drawing controls that appear on the left side of the map panel
     * @param currentOptions
     */
    function initDrawingControls(currentOptions) {
        var drawOptions = currentOptions.drawOptions || {},
            editOptions;

        _.defaults(drawOptions, DEFAULT_DRAW_OPTIONS);
        if(drawOptions.edit){
            editOptions = currentOptions.editOptions || {};
            _.defaults(editOptions, DEFAULT_EDIT_DRAW_OPTIONS);
        } else {
            editOptions = false;
        }

        drawControl = new L.Control.Draw({
            edit: editOptions,
            draw: drawOptions
        });
        mapImpl.addControl(drawControl);

        mapImpl.on("draw:created", function (event) {
            if (event.layerType === ALA.MapConstants.LAYER_TYPE.MARKER) {
                if (currentOptions.singleMarker) {
                    markers = [];
                }

                if (currentOptions.draggableMarkers) {
                    event.layer.options.draggable = true;
                    event.layer.on("dragend", self.notifyAll);
                }

                addMarker(event.layer, true);
            } else {
                addLayer(event.layer, true);
            }
        });
        mapImpl.on("draw:editstop", self.notifyAll);
        mapImpl.on("draw:deletestop", self.notifyAll);

        mapImpl.on("draw:drawstart", function (event) {
            drawingStarted(event.layerType);
        });

        registerSpinnerEvents();

        updateCircleFeaturesToIncludeTypeAndRadius();
    }

    function addWindowResizeListener() {
        window.addEventListener('resize', adjustMapContainerHeight);
    }

    function adjustMapContainerHeight() {
        var height = window.innerHeight - DEFAULT_MAP_HEIGHT_BUFFER;
        if (height >= options.minMapHeight) {
            $('#'+id).height(height);
            mapImpl && mapImpl.invalidateSize();
        }
    }

    function registerSpinnerEvents() {
        var loadingEvents = ["movestart", "dragstart", "zoomstart"];

        loadingEvents.forEach(function (eventName) {
            mapImpl.on(eventName, function () {
                self.startLoading();
            })
        });

        var loadingFinishedEvents = ["moveend", "dragend", "zoomend"];
        loadingFinishedEvents.forEach(function (eventName) {
            mapImpl.on(eventName, function () {
                self.finishLoading();
            })
        });
    }

    // Determines if existing items need to be removed before adding a new item
    function drawingStarted(layerType) {
        if (layerType === ALA.MapConstants.LAYER_TYPE.MARKER) {
            if (options.singleMarker) {
                markers.forEach(function (marker) {
                    drawnItems.removeLayer(marker);
                });
                markers = [];
                if (options.markerOrShapeNotBoth) {
                    drawnItems.clearLayers();
                }
            }
        } else if (options.singleDraw) {
            drawnItems.clearLayers();
            if (options.markerOrShapeNotBoth) {
                markers.forEach(function (marker) {
                    drawnItems.removeLayer(marker);
                });
                markers = [];
            }
        }
    }

    // This is a workaround for https://github.com/Leaflet/Leaflet/issues/2888
    // The GeoJSON standard does not support Circle types, so Leaflet treats circles as points. This workaround adds a
    // 'point_type' attribute to the the feature's properties with value 'Circle', and adds the radius, so at least the
    // feature properties include the circle details. This is still valid GeoJSON.
    function updateCircleFeaturesToIncludeTypeAndRadius() {
        var circleToGeoJSON = L.Circle.prototype.toGeoJSON;
        L.Circle.include({
            toGeoJSON: function () {
                var feature = circleToGeoJSON.call(this);
                feature.properties = {
                    point_type: ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE,
                    radius: this.getRadius()
                };
                return feature;
            }
        });
    }

    // Render any GeoJSON feature where the geometry type = Point but the properties contains point_type = 'Circle'
    // as a circle instead of a point. This is because GeoJSON does not support Circle types.
    function pointToLayerCircleSupport(feature, latlng) {
        if (feature.properties && feature.properties.point_type === ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE) {
            if (feature.properties.circleOptions)
                return L.circle(latlng, feature.properties.radius, feature.properties.circleOptions);
            else
                return L.circle(latlng, feature.properties.radius, {});
        } else {
            var marker = L.marker(latlng, {draggable: options.draggableMarkers});
            if (options.draggableMarkers) {
                marker.on("dragend", self.notifyAll);
            }
            markers.push(marker);
            return marker;
        }
    }

    // Adds the lat/lng coordinates to the bottom of the map panel
    function addCoordinates() {
        L.control.coordinates({
            position: "bottomright",
            decimals: 2,
            enableUserInput: false,
            useLatLngOrder: true
        }).addTo(mapImpl);
    }

    // Adds a loading spinner to the top right of the map
    function addLoadingControl() {
        var loadingControl = L.Control.loading({
            separate: true,
            position: "topright"
        });
        mapImpl.addControl(loadingControl);
    }

    // The container div is expected to have an attribute 'data-leaflet-img' which contains the path to the Leaflet images.
    // The path is the absolute URL, minus the host/port.
    function getLeafletImageLocation() {
        return $("#" + id).attr("data-leaflet-img");
    }

    // Display an input field and search button to allow the user to enter an address, then perform a geocode address
    // search and place a marker on the map
    function addGeocodeControl(drawType) {
        var prompt = "Search for an address or location";
        if (drawType == ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE) {
            prompt = "Search for a region, area or address";
        }

        var geocodeControl = L.Control.geocoder({
            position: "topleft",
            placeholder: prompt,
            defaultMarkGeocode: false,
            geocoder: new L.Control.Geocoder.Nominatim({
                geocodingQueryParams: {polygon_geojson: 1, dedupe: 1}
            })
        }).addTo(mapImpl);

        var button = $(geocodeControl._container).find("a");
        button.attr("title", prompt);

        if (drawType == ALA.MapConstants.DRAW_TYPE.POINT_TYPE) {
            button.addClass("geocoder-icon-override fa fa-crosshairs");
        }


        geocodeControl.on('markgeocode', function (result) {
            if (drawType == ALA.MapConstants.DRAW_TYPE.POINT_TYPE) {
                self.addMarker(result.geocode.center.lat, result.geocode.center.lng, null);
            } else if (drawType == ALA.MapConstants.DRAW_TYPE.POLYGON_TYPE) {
                var geojson = {
                    type: "Feature",
                    geometry: result.geocode.properties.geojson,
                    properties: {}
                };

                if (options.geocodeRegionOptions.pointToCircle) {
                    // when selecting a geocoded region that has a Point type, we will convert it to a circle with a
                    // specific radius
                    if (geojson.geometry.type == ALA.MapConstants.DRAW_TYPE.POINT_TYPE) {
                        geojson.properties.point_type = ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE;
                        geojson.properties.radius = options.geocodeRegionOptions.pointRadiusMeters;
                    }
                }
                var layer = self.setGeoJSON(geojson);

                if (options.zoomToObject) {
                    layer && layer.getBounds && mapImpl.fitBounds(layer.getBounds(), {maxZoom: options.maxAutoZoom, animate: ANIMATE});
                }
            } else {
                self.addMarker(result.geocode.center.lat, result.geocode.center.lng, null);
            }
            //Fire a 'SearchEventFired' for site creation
            mapImpl.fire("searchEventFired");

        }, geocodeControl);
    }

    // Internal method to add a non-Marker layer to the map, to fit the map bounds if configured to do so, and optionally
    // to notify all subscribers that the map has changed.
    function addLayer(layer, notify) {
        self.startLoading();

        layer.addTo(drawnItems);

        if (options.zoomToObject && layer.getBounds) {
            mapImpl.fitBounds(drawnItems.getBounds(), {maxZoom: options.maxAutoZoom, animate: ANIMATE});
            mapImpl.invalidateSize();
        }

        if (notify) {
            self.notifyAll();
        }

        self.finishLoading();
    }

    // Internal method to add a Marker to the map, to fit the map bounds if configured to do so, and optionally to notify
    // all subscribers that the map has changed.
    function addMarker(marker, notify) {
        self.startLoading();

        drawingStarted(ALA.MapConstants.LAYER_TYPE.MARKER);

        if (options.draggableMarkers) {
            marker.on("dragend", self.notifyAll);
        }

        marker.addTo(drawnItems);
        markers.push(marker);
        self.finishLoading();
        if (options.zoomToObject) {
            mapImpl.panTo(marker.getLatLng(), {animate: ANIMATE});
            mapImpl.fitBounds(new L.LatLngBounds(marker.getLatLng(), marker.getLatLng()), {maxZoom: SINGLE_POINT_ZOOM});
        }

        if (notify) {
            self.notifyAll();
        }

    }

    // Internal function to create a new WMS layer, but not to add it to the map, or trigger any notifications
    function createWmsLayer(pid, wmsOptions) {
        wmsOptions = wmsOptions || {};
        if (!_.isUndefined(pid) && pid != null) {
            wmsOptions.pid = pid;
            wmsOptions.viewparams = "s:" + pid;
            wmsOptions.wmsFeatureUrl = options.wmsFeatureUrl + pid;

        }

        wmsOptions.callback = function () {
            if (options.zoomToObject) {
                self.fitBounds();
            }
            self.notifyAll();
            self.finishLoading();
        };

        _.defaults(wmsOptions, DEFAULT_WMS_PROPERTIES);

        if ((_.isUndefined(options.wmsLayerUrl) || options.wmsLayerUrl == null) && (_.isUndefined(wmsOptions.wmsLayerUrl) || wmsOptions.wmsLayerUrl == null)) {
            console.error("[ALA-Map] You must specify the wmsLayerUrl option for this map or for the layer.")
        }

        return L.tileLayer.smartWms(wmsOptions.wmsLayerUrl || options.wmsLayerUrl, wmsOptions);
    }

    // Internal function to apply layer-specific options to the provided layer. Handles all the logic to determine if
    // particular options can be applied to different layer types
    function applyLayerOptions(layer, layerOptions) {
        if (_.isUndefined(layerOptions)) {
            layerOptions = {};
        }
        _.defaults(layerOptions, LAYER_OPTIONS);

        if (layer.bindPopup && layerOptions.popup && (!layerOptions.markerWithMouseOver || !layer.setStyle)) {
            layer.bindPopup(layerOptions.popup);
        }

        if (layerOptions.markerWithMouseOver) {
            hideLayer(layer);

            var centre = layerOptions.markerLocation ? layerOptions.markerLocation : layer.getBounds().getCenter();
            var placeholder = L.marker(centre);
            placeholder.on("mouseover", function () {
                showLayer(layer);
            });
            placeholder.on("mouseout", function () {
                hideLayer(layer);
            });

            if (layerOptions.popup) {
                placeholder.bindPopup(layerOptions.popup);
            }
            // this is not considered to be a 'marker' as with those added via addMarker, so don't add it to
            // the 'markers' list.
            drawnItems.addLayer(placeholder);
        }
    }

    function hideLayer(layer) {
        if (layer.setStyle) {
            layer.setStyle(HIDDEN_LAYER)
        } else if (layer.setOpacity) {
            layer.setOpacity(0);
        } else if (layer.options) {
            layer.options.opacity = 0;
        }
    }

    function showLayer(layer) {
        if (layer.setStyle) {
            layer.setStyle(VISIBLE_LAYER)
        } else if (layer.setOpacity) {
            layer.setOpacity(DEFAULT_OPACITY);
        } else if (layer.options) {
            layer.options.opacity = DEFAULT_OPACITY;
            layer.options.weight = DEFAULT_LINE_WEIGHT;
        }

        if (layer.bringToFront) {
            layer.bringToFront();
        }
    }

    function clearMarkers() {
        markers.forEach(function (marker) {
            drawnItems.removeLayer(marker);
        });
        markers = [];
    }

    /**
     * Internal function to add an overlay layer to the layers control.
     * @param {L.Class} layer Layer to add.
     * @param {String} name Text to display for the layer.
     * @param {Boolean} isSelected Whether to add the layer in the selected state or not.
     */
    function overlayLayerAdd(layer, name, isSelected){
        if (layerControl) {
            layerControl.addOverlay(layer, name);
            overlayLayersAvailable.push(layer);
            if (isSelected) {
                mapImpl.addLayer(layer);
                overlayLayerSelect(layer);
            }
            console.log("[ALA-Map] Added " + (isSelected ? 'selected' : 'de-selected') + " overlay layer '" + name + "' to map.");
        } else {
            console.warn("[ALA-Map] Could not add overlay layer '" + name + "' because the layer control is not available. " +
                "Create the layer control before adding an overlay layer.")
        }
    }

    /**
     * Internal function to remove an overlay layer from the layers control.
     * @param {L.Class} layer The layer to remove.
     */
    function overlayLayerRemove(layer){
        if (layerControl) {
            overlayLayerDeselect(layer);
            layerControl.removeLayer(layer);
            var index = overlayLayersAvailable.indexOf(layer);
            if (index > -1) {
                overlayLayersAvailable.splice(index, 1);
            }
        }

        mapImpl.removeLayer(layer);
    }

    /**
     * Internal function to select an overlay layer.
     * @param {L.Class} layer
     */
    function overlayLayerSelect(layer){
        if (!options.preserveZIndex) {
            layer.bringToFront();
        }
        overlayLayersSelected.push(layer);
    }

    /**
     * Internal function to de-select an overlay layer.
     * @param {L.Class} layer
     */
    function overlayLayerDeselect(layer){
        var index = overlayLayersSelected.indexOf(layer);
        if (index > -1) {
            overlayLayersSelected.splice(index, 1);
        }
    }

    function addBaseLayerHeading (containerSelector) {
        var classHeading = 'leaflet-control-layers-base-heading',
            classBaseLayer = 'leaflet-control-layers-base',
            isHeadingPresent = $(containerSelector + ' .' + classHeading).length == 1,
            isBaseLayerPresent = $(containerSelector + ' .' + classBaseLayer).children().length >= 1;

        if (!isHeadingPresent && isBaseLayerPresent)
            $('<label class="' + classHeading + '"><strong>Base layer</strong></label>').insertBefore(containerSelector + ' .' + classBaseLayer);
    };

    function addOverlayHeading(containerSelector) {
        var classHeading = 'leaflet-control-layers-overlays-heading',
            classOverlay = 'leaflet-control-layers-overlays',
            isHeadingPresent = $(containerSelector + ' .' + classHeading).length == 1,
            isOverlayPresent = $(containerSelector + ' .' + classOverlay).children().length >= 1;

        if (!isHeadingPresent && isOverlayPresent)
            $('<label class="' + classHeading + '"><strong>Overlay</strong></label>').insertBefore(containerSelector + ' .' + classOverlay);
    };

    function addBaseLayerAndOverlayHeading (containerSelector) {
        addBaseLayerHeading(containerSelector);
        addOverlayHeading(containerSelector);
    };

    initialiseMap();
};

/**
 * @class
 * @memberOf ALA
 */
ALA.MapUtils = {

    /**
     * Utility method to take a standard GeoJSON object and change the geometry of Point types to Circle types (not
     * supported by the GeoJSON standard). This function assumes that the properties object of the circle features has
     * a property of 'point_type' with a value of 'circle', and a property of 'radius'.
     *
     * I.e. this function will convert
     * <code>
     *      {
     *         "type": "FeatureCollection",
     *         "features": [
     *           {
     *             "type": "Feature",
     *             "properties": {
     *               "point_type": "circle",
     *               "radius": 1027747.8506951465
     *             },
     *             "geometry": {
     *               "type": "Point",
     *               "coordinates": [
     *                 122.51953124999999,
     *                 -13.410994034321702
     *               ]
     *             }
     *           }
     *         ]
     *       }
     * </code>
     * into
     * <code>
     * {
     *     "type": "FeatureCollection",
     *     "features": [
     *       {
     *         "type": "Feature",
     *         "properties": {
     *           "point_type": "circle",
     *           "radius": 1027747.8506951465
     *         },
     *         "geometry": {
     *           "type": "Circle",
     *           "coordinates": [
     *             122.51953124999999,
     *             -13.410994034321702
     *           ],
     *           "centre": [
     *             122.51953124999999,
     *             -13.410994034321702
     *           ],
     *           "radius": 1027747.8506951465
     *         }
     *       }
     *     ]
     *   }
     * </code>
     * @param geoJSON
     * @returns {*}
     */
    getGeometryWithCirclesFromGeoJSON: function (geoJSON) {
        if (!_.isUndefined(geoJSON) && !_.isEmpty(geoJSON.features)) {
            _.each(geoJSON.features, function (feature) {
                if (feature.properties.point_type == ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE) {
                    feature.geometry.type = ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE;
                    feature.geometry.centre = feature.geometry.coordinates;
                    feature.geometry.radius = feature.properties.radius;
                }
            })
        }

        return geoJSON;
    },

    /**
     * Performs the opposite of {@link #getGeometryWithCirclesFromGeoJSON} to produce valid standard GeoJSON.
     *
     * @param geoJSON The modified GeoJSON to be converted back to the standard format.
     * @returns {GeoJSON}
     */
    getStandardGeoJSONForCircleGeometry: function (geoJSON) {
        if (!_.isUndefined(geoJSON) && !_.isEmpty(geoJSON.features)) {
            _.each(geoJSON.features, function (feature) {
                if (feature.geometry.type === ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE) {
                    feature.properties.point_type = ALA.MapConstants.DRAW_TYPE.CIRCLE_TYPE;
                    feature.properties.radius = feature.geometry.radius;
                    delete feature.geometry.radius;
                    feature.geometry.type = ALA.MapConstants.DRAW_TYPE.POINT_TYPE;
                }
            })
        }

        return geoJSON;
    },

    /**
     * Takes a bare geoJSON geometry object, and wraps it in a full GeoJSON structure with type=FeatureCollection
     *
     * @param geometry The geoJSON geometry object to wrap
     * @returns {Object} Full GeoJSON structure with type=FeatureCollection
     */
    wrapGeometryInGeoJSONFeatureCol: function (geometry) {
        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: geometry
                }
            ]
        };
    },

    /**
     * Converts a bounding box string of format POLYGON((lng1 lat1, lng2 lat2,...)) (POLYGON or LINESTRING) into an
     * array of coordinates. The order of the latitude and longitude can be controlled by the latFirst parameter.
     *
     * @param bboxString Bounding box string to convert
     * @param latFirst True to produce LAT/LNG points, false to produce LNG/LAT points.
     * @returns {Array} array of points
     */
    bboxToPointArray: function (bboxString, latFirst) {
        var coords = bboxString.replace(/POLYGON|LINESTRING|POINT/g, "").replace(/[\\(|\\)]/g, "");
        var coordsArray = [];
        coords.split(",").forEach(function (item) {
            var coordinates = latFirst ? item.split(" ").reverse() : item.split(" ");
            coordinates = coordinates || [];
            coordinates.forEach(function (t, index) {
                coordinates[index]  = Number.parseFloat(t);
            });
            coordsArray.push(coordinates);
        });

        return coordsArray;
    },

    /**
     * Utility function to create a new marker icon with sensible defaults
     *
     * @param iconUrl {String} The URL to the image for the marker. Mandatory.
     * @param iconOptions {Object} Object containing leaflet Icon configuration options to override the defaults. Optional.
     * @returns {Object} Leaflet Icon object
     */
    createIcon: function (iconUrl, iconOptions) {
        if (_.isUndefined(iconOptions)) {
            iconOptions = {};
        }

        var defaultOptions = {
            iconUrl: iconUrl,
            iconRetinaUrl: iconUrl,
            iconSize: [25, 40],
            popupAnchor: [0, -25]
        };

        _.defaults(iconOptions, defaultOptions);

        return L.icon(iconOptions);
    },

    /**
     * Convenience utility for creating a new marker with optional configuration parameters and popup.
     *
     * @param lat {Number} Latitude of the marker. Mandatory.
     * @param lng {Number} Longitude of the marker. Mandatory.
     * @param popup {String} Text or HTML to display in a popup when the marker is clicked. Optional.
     * @param markerOptions {Object} Standard Leaflet L.Marker configuration options. Optional.
     * @return {Object} Leaflet L.Marker object
     */
    createMarker: function (lat, lng, popup, markerOptions) {
        var marker = L.marker([lat, lng], markerOptions);

        if (popup) {
            marker.bindPopup(popup);
        }

        return marker;
    },

    /**
     * Calculate the area of a given GeoJSON object in square kilometers. The GeoJSON object can be a FeatureCollection or a Feature.
     *
     * For circle geometries, the Properties object must contain an attribute called Radius, with the radius in meters.
     *
     * @param geoJson {Object} GeoJSON object to calculate the area for
     * @returns {number} The calculated area in square kilometers
     */
    calculateAreaKmSq: function (geoJson) {
        // uses Turf from MapBox. The turf.area function returns the area in square meters.
        var areaSqKm = turf.area(geoJson) / 1000000;

        // Turf (and GeoJSON) doesn't support circles, so check if there are any and add them to the total
        // This will work as long as the radius has been included in the properties object of the feature
        if (geoJson.type == "FeatureCollection") {
            geoJson.features.forEach(function (feature) {
                if (feature.properties.radius) {
                    areaSqKm += ((3.14 * feature.properties.radius * feature.properties.radius) / 1000) / 1000;
                }
            });
        } else if (geoJson.type == "Feature") {
            if (geoJson.properties.radius) {
                areaSqKm += ((3.14 * geoJson.properties.radius * geoJson.properties.radius) / 1000) / 1000;
            }
        }

        return areaSqKm;
    }
};
