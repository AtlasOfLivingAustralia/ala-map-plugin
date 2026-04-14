describe("AdvancedFileLoader tests", function () {

    var ID = "mapId";
    var map;
    var html = "<div id='" + ID + "' data-leaflet-img='pathToLeafletImages' style='height:600px;width:100%'/>";
    var loader;

    beforeAll(function () {
        console.log("****** AdvancedFileLoader tests ******");
    });

    afterAll(function () {
        console.log("----------------------------");
    });

    beforeEach(function () {
        $('#mapId').remove();
        $(document.body).html(html);
        map = new ALA.Map(ID);
        loader = L.FileLayer.advancedFileLoader(map.getMapImpl(), {});
    });

    afterEach(function () {
        if (loader) {
            loader.off();
        }
    });

    // Helper function to create mock file objects
    function createMockFile(name, content, type) {
        var blob = new Blob([content], { type: type || 'text/plain' });
        blob.name = name;
        blob.size = content.length;
        blob.testing = true; // Flag to skip actual FileReader operation
        return blob;
    }

    // Helper function to create a mock FileReader
    function mockFileReader(result, isArrayBuffer) {
        var originalFileReader = window.FileReader;
        var mockReader = {
            readAsText: function (file) {
                var self = this;
                setTimeout(function () {
                    self.result = result;
                    if (self.onload) {
                        self.onload({ target: { result: result } });
                    }
                }, 10);
            },
            readAsArrayBuffer: function (file) {
                var self = this;
                setTimeout(function () {
                    self.result = result;
                    if (self.onload) {
                        self.onload({ target: { result: result } });
                    }
                }, 10);
            }
        };
        window.FileReader = function () {
            return mockReader;
        };
        return function restore() {
            window.FileReader = originalFileReader;
        };
    }

    describe("initialization", function () {

        it("should initialize with map and options", function () {
            expect(loader).toBeDefined();
            expect(loader._map).toBe(map.getMapImpl());
        });

        it("should have parsers for supported formats", function () {
            expect(loader._parsers.geojson).toBeDefined();
            expect(loader._parsers.json).toBeDefined();
            expect(loader._parsers.gpx).toBeDefined();
            expect(loader._parsers.kml).toBeDefined();
            expect(loader._parsers.zip).toBeDefined();
        });
    });

    describe("file loading", function () {

        it("should return false when file parameter is missing", function () {
            var result = loader.load(undefined, 'geojson');
            expect(result).toBe(false);
        });

        it("should return false when file size exceeds limit", function () {
            loader.options.fileSizeLimit = 0.1; // 100 bytes
            var largeContent = new Array(200).join('a');
            var file = createMockFile('large.geojson', largeContent, 'application/json');

            var result = loader.load(file, 'geojson');
            expect(result).toBe(false);
        });

        it("should return false for unsupported file types", function () {
            var file = createMockFile('test.txt', 'some content', 'text/plain');
            var result = loader.load(file, 'txt');
            expect(result).toBe(false);
        });
    });

    describe("GeoJSON loading", function () {

        it("should load valid GeoJSON file", function (done) {
            var geoJson = JSON.stringify({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [125.6, 10.1]
                },
                "properties": {
                    "name": "Test Point"
                }
            });

            var restore = mockFileReader(geoJson, false);

            loader.on('data:loaded', function (e) {
                expect(e.layer).toBeDefined();
                expect(e.filename).toBe('test.geojson');
                expect(e.format).toBe('geojson');
                restore();
                done();
            });

            loader.on('data:error', function (e) {
                restore();
                fail('Should not trigger error: ' + e.error);
                done();
            });

            var file = createMockFile('test.geojson', geoJson, 'application/json');
            delete file.testing; // Allow actual reading
            loader.load(file, 'geojson');
        });

        it("should fire data:loading event before processing", function (done) {
            var geoJson = JSON.stringify({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [125.6, 10.1]
                },
                "properties": {}
            });

            var restore = mockFileReader(geoJson, false);
            var loadingFired = false;

            loader.on('data:loading', function (e) {
                loadingFired = true;
                expect(e.filename).toBe('test.geojson');
                expect(e.format).toBe('geojson');
            });

            loader.on('data:loaded', function (e) {
                expect(loadingFired).toBe(true);
                restore();
                done();
            });

            var file = createMockFile('test.geojson', geoJson, 'application/json');
            delete file.testing;
            loader.load(file, 'geojson');
        });

        it("should fire data:error event for invalid GeoJSON", function (done) {
            var invalidJson = "{ invalid json }";

            var restore = mockFileReader(invalidJson, false);

            loader.on('data:error', function (e) {
                expect(e.error).toBeDefined();
                restore();
                done();
            });

            loader.on('data:loaded', function (e) {
                restore();
                fail('Should not trigger loaded event for invalid JSON');
                done();
            });

            var file = createMockFile('invalid.geojson', invalidJson, 'application/json');
            delete file.testing;
            loader.load(file, 'geojson');
        });
    });

    describe("Shapefile (ZIP) loading", function () {

        it("should handle shapefile zip files", function (done) {
            // Mock ArrayBuffer for shapefile
            var mockArrayBuffer = new ArrayBuffer(8);

            // Mock the global shp function to return valid GeoJSON
            var originalShp = window.shp;
            window.shp = jasmine.createSpy('shp').and.returnValue(Promise.resolve({
                "type": "FeatureCollection",
                "features": [{
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [125.6, 10.1]
                    },
                    "properties": {
                        "name": "Test Point"
                    }
                }]
            }));

            var restore = mockFileReader(mockArrayBuffer, true);

            loader.on('data:loaded', function (e) {
                expect(e.layer).toBeDefined();
                expect(e.filename).toBe('test.zip');
                expect(e.format).toBe('zip');
                expect(window.shp).toHaveBeenCalledWith(mockArrayBuffer);
                window.shp = originalShp;
                restore();
                done();
            });

            loader.on('data:error', function (e) {
                window.shp = originalShp;
                restore();
                fail('Should not trigger error: ' + e.error);
                done();
            });

            var file = createMockFile('test.zip', mockArrayBuffer, 'application/zip');
            delete file.testing;
            loader.load(file, 'zip');
        });

        it("should fire error event when shapefile processing fails", function (done) {
            var mockArrayBuffer = new ArrayBuffer(8);

            var originalShp = window.shp;
            window.shp = jasmine.createSpy('shp').and.callFake(
                function () {
                    return new Promise(function(resolve, reject) {
                        setTimeout(function() {
                            reject(new Error('Invalid shapefile'));
                        }, 0);
                    });
                }
            );

            var restore = mockFileReader(mockArrayBuffer, true);

            loader.on('data:error', function (e) {
                expect(e.error).toBeDefined();
                expect(e.error.message).toBe('Invalid shapefile');
                window.shp = originalShp;
                restore();
                done();
            });

            loader.on('data:loaded', function (e) {
                window.shp = originalShp;
                restore();
                fail('Should not trigger loaded event for invalid shapefile');
                done();
            });

            var file = createMockFile('invalid.zip', mockArrayBuffer, 'application/zip');
            delete file.testing;
            loader.load(file, 'zip');
        });
    });

    describe("GPX and KML conversion", function () {

        it("should convert GPX to GeoJSON", function (done) {
            var gpxContent = '<?xml version="1.0"?><gpx version="1.1"><wpt lat="10.1" lon="125.6"><name>Test</name></wpt></gpx>';

            // Mock toGeoJSON conversion
            var originalToGeoJSON = window.toGeoJSON;
            window.toGeoJSON = {
                gpx: jasmine.createSpy('gpx').and.returnValue({
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [125.6, 10.1]
                        },
                        "properties": {}
                    }]
                })
            };

            var restore = mockFileReader(gpxContent, false);

            loader.on('data:loaded', function (e) {
                expect(e.layer).toBeDefined();
                expect(e.filename).toBe('test.gpx');
                window.toGeoJSON = originalToGeoJSON;
                restore();
                done();
            });

            loader.on('data:error', function (e) {
                window.toGeoJSON = originalToGeoJSON;
                restore();
                fail('Should not trigger error: ' + e.error);
                done();
            });

            var file = createMockFile('test.gpx', gpxContent, 'application/gpx+xml');
            delete file.testing;
            loader.load(file, 'gpx');
        });

        it("should convert KML to GeoJSON", function (done) {
            var kmlContent = '<?xml version="1.0"?><kml xmlns="http://www.opengis.net/kml/2.2"><Placemark><Point><coordinates>125.6,10.1</coordinates></Point></Placemark></kml>';

            var originalToGeoJSON = window.toGeoJSON;
            window.toGeoJSON = {
                kml: jasmine.createSpy('kml').and.returnValue({
                    "type": "FeatureCollection",
                    "features": [{
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [125.6, 10.1]
                        },
                        "properties": {}
                    }]
                })
            };

            var restore = mockFileReader(kmlContent, false);

            loader.on('data:loaded', function (e) {
                expect(e.layer).toBeDefined();
                expect(e.filename).toBe('test.kml');
                window.toGeoJSON = originalToGeoJSON;
                restore();
                done();
            });

            loader.on('data:error', function (e) {
                window.toGeoJSON = originalToGeoJSON;
                restore();
                fail('Should not trigger error: ' + e.error);
                done();
            });

            var file = createMockFile('test.kml', kmlContent, 'application/vnd.google-earth.kml+xml');
            delete file.testing;
            loader.load(file, 'kml');
        });
    });

    describe("testing mode", function () {

        it("should skip FileReader when file.testing is true", function () {
            var file = createMockFile('test.geojson', '{"type":"Feature"}', 'application/json');
            file.testing = true;

            spyOn(FileReader.prototype, 'readAsText');
            spyOn(FileReader.prototype, 'readAsArrayBuffer');

            var reader = loader.load(file, 'geojson');

            expect(FileReader.prototype.readAsText).not.toHaveBeenCalled();
            expect(FileReader.prototype.readAsArrayBuffer).not.toHaveBeenCalled();
        });
    });

    describe("file extension detection", function () {

        it("should detect .json extension as GeoJSON", function (done) {
            var geoJson = JSON.stringify({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [125.6, 10.1]
                },
                "properties": {}
            });

            var restore = mockFileReader(geoJson, false);

            loader.on('data:loaded', function (e) {
                expect(e.format).toBe('json');
                restore();
                done();
            });

            var file = createMockFile('test.json', geoJson, 'application/json');
            delete file.testing;
            loader.load(file, 'json');
        });
    });
});

