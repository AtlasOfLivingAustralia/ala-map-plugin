L.FileLayer.AdvancedFileLoader = L.FileLayer.FileLoader.extend({
    options: {
        checkShapeFileValidity: true,
        shapeFileMustContain: ['shp', 'shx', 'dbf', 'prj']
    },
    initialize: function (map, options) {
        this._map = map;
        L.Util.setOptions(this, options);

        this._parsers = {
            geojson: this._loadGeoJSON,
            json: this._loadGeoJSON,
            gpx: this._convertToGeoJSON,
            kml: this._convertToGeoJSON,
            kmz: this._convertKmzToGeoJSON,
            zip: this._convertShpToGeoJSON
        };
    },
    _convertKmzToGeoJSON: async function (content) {
        for (const entry of butUnzip.iter(new Uint8Array(content))) {
            if (entry.filename.toLowerCase().endsWith('.kml')) {
                var kmlContent = await entry.read();
                var textDecoder = new TextDecoder('utf-8');
                kmlContent = textDecoder.decode(kmlContent);
                return this._convertToGeoJSON(kmlContent, 'kml');
            }
        }

        throw new Error('KMZ archive does not contain a KML file.');
    },
    _convertShpToGeoJSON: async function (content) {
        if (await this.checkShapeFile(content)) {
            var geoJson = await shp(content);
            // if more than one shp file in a zip, shp.js returns an array of geojson objects, we need to merge them into a single feature collection
            if (Array.isArray(geoJson)) {
                // merge features into a single feature collection
                geoJson = {
                    type: "FeatureCollection",
                    features: geoJson.reduce((acc, feature) => {
                        if (feature.type === "FeatureCollection") {
                            acc.push(...feature.features);
                        } else if (feature.type === "Feature") {
                            acc.push(feature);
                        }
                        return acc;
                    }, []),
                    properties: geoJson.reduce((acc, feature) => {
                        if (feature.properties) {
                            Object.assign(acc, feature.properties);
                        }
                        return acc;
                    }, {})
                };
            }

            return this._loadGeoJSON(geoJson);
        }
    },
    _loadGeoJSON: function _loadGeoJSON(content) {
        var layer;
        if (typeof content === 'string') {
            content = JSON.parse(content);
        }
        return Promise.resolve(
            this.options.layer(content, this.options.layerOptions)
        ).then(L.Util.bind(function (layer) {
            if (!layer)
                return null;

            if (layer.getLayers().length === 0) {
                throw new Error('GeoJSON has no valid layers.');
            }

            if (this.options.addToMap) {
                layer.addTo(this._map);
            }

            return layer;
        }, this));
    },
    checkShapeFile: async function (arrayBuffer) {
        if (this.options.checkShapeFileValidity) {
            if (typeof butUnzip === 'undefined') {
                throw new Error('butUnzip library is required to validate shapefile zip files');
            }

            var files = [];
            for (const entry of butUnzip.iter(new Uint8Array(arrayBuffer))) {
                files.push(entry.filename);
            }

            var missingFiles = this.options.shapeFileMustContain.filter(function (file) {
                return !files.some(function (f) {
                    return f.toLowerCase().endsWith('.' + file);
                });
            });

            if (missingFiles.length > 0) {
                throw new Error('The shapefile zip file is missing the following required files: ' + missingFiles.join(', '));
            }

            return true;
        }
        else
            return true;
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
                return Promise.resolve(
                    parser.processor.call(this, e.target.result, parser.ext)
                ).then(L.Util.bind(function (layer) {
                    this.fire('data:loaded', {
                        layer: layer,
                        filename: file.name,
                        format: parser.ext
                    });
                }, this)).catch(L.Util.bind(function (err) {
                    this.fire('data:error', { error: err });
                }, this));
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
                case 'kmz':
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