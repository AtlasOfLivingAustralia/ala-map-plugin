L.FileLayer.AdvancedFileLoader = L.FileLayer.FileLoader.extend({
    initialize: function (map, options) {
        this._map = map;
        L.Util.setOptions(this, options);

        this._parsers = {
            geojson: this._loadGeoJSON,
            json: this._loadGeoJSON,
            gpx: this._convertToGeoJSON,
            kml: this._convertToGeoJSON,
            zip: this._convertShpToGeoJSON
        };
    },
    _convertShpToGeoJSON: async function (content) {
        var geoJson = await shp(content);
        return this._loadGeoJSON(geoJson);
    },
    load: function (file, ext) {
        var parser,
            reader;

        // Check file is defined
        if (this._isParameterMissing(file, 'file')) {
            return false;
        }

        // Check file size
        if (!this._isFileSizeOk(file.size)) {
            return false;
        }

        // Get parser for this data type
        parser = this._getParser(file.name, ext);
        if (!parser) {
            return false;
        }

        // Read selected file using HTML5 File API
        reader = new FileReader();
        reader.onload = L.Util.bind(async function (e) {
            var layer;
            try {
                this.fire('data:loading', { filename: file.name, format: parser.ext });
                if (typeof e.target.result === 'string') {
                    layer = parser.processor.call(this, e.target.result, parser.ext);
                }
                else if (e.target.result instanceof ArrayBuffer) {
                    layer = await parser.processor.call(this, e.target.result, parser.ext);
                }
                this.fire('data:loaded', {
                    layer: layer,
                    filename: file.name,
                    format: parser.ext
                });
            } catch (err) {
                this.fire('data:error', { error: err });
            }
        }, this);
        // Testing trick: tests don't pass a real file,
        // but an object with file.testing set to true.
        // This object cannot be read by reader, just skip it.
        if (!file.testing) {
            switch (parser.ext) {
                case 'zip':
                    reader.readAsArrayBuffer(file);
                    break;
                default:
                    reader.readAsText(file);
                    break;
            }
        }
        // We return this to ease testing
        return reader;
    }
});

L.FileLayer.advancedFileLoader = function (map, options) {
    return new L.FileLayer.AdvancedFileLoader(map, options);
};