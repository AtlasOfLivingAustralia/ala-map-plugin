var AdvancedFileLayerLoad = L.Control.FileLayerLoad.extend({
    statics: {
        TITLE: 'Load geometry file (Shapefile, GPX, KML, KMZ, GeoJSON)',
        LABEL: '&#128194;'
    },
    onAdd: function (map) {
        L.Control.FileLayerLoad.LABEL = L.Control.AdvancedFileLayerLoad.LABEL;
        L.Control.FileLayerLoad.TITLE = L.Control.AdvancedFileLayerLoad.TITLE;
        this.loader = L.FileLayer.advancedFileLoader(map, this.options);

        this.loader.on('data:loaded', function (e) {
            // Fit bounds after loading
            if (this.options.fitBounds) {
                window.setTimeout(function () {
                    map.fitBounds(e.layer.getBounds());
                }, 500);
            }
        }, this);

        // Initialize Drag-and-drop
        this._initDragAndDrop(map);

        // Initialize map control
        return this._initContainer();
    }
});

L.Control.AdvancedFileLayerLoad = AdvancedFileLayerLoad;
L.Control.advancedFileLayerLoad = function (options) {
    return new L.Control.AdvancedFileLayerLoad(options);
};
