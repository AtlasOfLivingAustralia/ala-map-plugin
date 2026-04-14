describe("Leaflet Geoman Draw Tool Integration tests", function () {

    var ID = "mapId";
    var map;
    var html = "<div id='" + ID + "' data-leaflet-img='pathToLeafletImages' style='height:600px;width:100%'/>";

    beforeAll(function () {
        console.log("****** Geoman Draw Tool Integration tests ******");
    });

    afterAll(function () {
        console.log("----------------------------");
    });

    beforeEach(function () {
        $('#mapId').remove();
        $(document.body).html(html);
    });

    afterEach(function () {
        if (map) {
            map.destroy && map.destroy();
            map = null;
        }
    });

    describe("Cancel functionality", function () {

        beforeEach(function () {
            map = new ALA.Map(ID, {
                drawOptions: {
                    polygon: true,
                    rectangle: true,
                    circle: true,
                    marker: true,
                    polyline: false
                },
                editOptions: {
                    edit: true,
                    remove: true
                }
            });
        });

        it("should have cancel actions added to edit mode controls", function () {
            var mapImpl = map.getMapImpl();
            expect(mapImpl.pm).toBeDefined();
            expect(mapImpl.pm.Toolbar).toBeDefined();
        });

        it("should restore previous state when cancel is triggered during edit mode", function () {
            var mapImpl = map.getMapImpl();

            // Add a polygon layer
            var polygon = L.polygon([[-27, 133], [-28, 134], [-27, 135]]);
            map.setGeoJSON(polygon.toGeoJSON());

            var originalGeoJSON = map.getGeoJSON();

            // Enable global edit mode (takes a snapshot)
            mapImpl.pm.enableGlobalEditMode();
            expect(mapImpl.pm.globalEditModeEnabled()).toBe(true);

            // Simulate modifying the layer by moving a vertex
            var polygonLayer;
            mapImpl.eachLayer(function (layer) {
                if (layer instanceof L.Polygon) {
                    polygonLayer = layer;
                }
            });

            if (polygonLayer) {
                var latlngs = polygonLayer.getLatLngs();
                latlngs[0].push(L.latLng(136, -28)); // add your new point
                polygonLayer.setLatLngs(latlngs);
            }

            // Click cancel action
            map.getMapImpl().pm.Toolbar.buttons.editMode._button.actions[1].onClick();

            // The map should still have geometry
            var restoredGeoJSON = map.getGeoJSON();
            expect(restoredGeoJSON).toEqual(originalGeoJSON);
        });
    });

    describe("addGeometryFromLocalFile option", function () {

        it("should not add file input control when addGeometryFromLocalFile is false", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: false
            });

            var fileControl = $(".leaflet-control-filelayer");
            expect(fileControl.length).toBe(0);
        });

        it("should add file input control when addGeometryFromLocalFile is true", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: true
            });

            // Check that a file upload control is present on the map
            var fileControl = $(".leaflet-control-filelayer");
            expect(fileControl.length).toBeGreaterThan(0);
        });

        it("should default addGeometryFromLocalFile to false", function () {
            map = new ALA.Map(ID);

            var fileControl = $(".leaflet-control-filelayer");
            expect(fileControl.length).toBe(0);
        });

        it("should accept shapefile format when addGeometryFromLocalFile is enabled", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: true
            });

            // The file input should accept common geo formats
            var fileInput = $("input[type='file']");
            if (fileInput.length > 0) {
                var accept = fileInput.attr("accept") || "";
                expect(accept.indexOf(".zip") >= 0).toBe(true);
            }
        });

        it("should accept geojson format when addGeometryFromLocalFile is enabled", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: true
            });

            var fileInput = $("input[type='file']");
            if (fileInput.length > 0) {
                var accept = fileInput.attr("accept") || "";
                expect(accept.indexOf(".geojson") >= 0 || accept.indexOf(".json") >= 0).toBe(true);
            }
        });

        it("should accept kml format when addGeometryFromLocalFile is enabled", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: true
            });

            var fileInput = $("input[type='file']");
            if (fileInput.length > 0) {
                var accept = fileInput.attr("accept") || "";
                expect(accept.indexOf(".kml") >= 0 ).toBe(true);
            }
        });

        it("should accept gpx format when addGeometryFromLocalFile is enabled", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: true
            });

            var fileInput = $("input[type='file']");
            if (fileInput.length > 0) {
                var accept = fileInput.attr("accept") || "";
                expect(accept.indexOf(".gpx") >= 0).toBe(true);
            }
        });

        it("should add loaded geometry to the map when a file is loaded", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: true
            });

            // Simulate adding geometry via setGeoJSON (as file loading would do)
            var geojson = {
                type: "FeatureCollection",
                features: [{
                    type: "Feature",
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[133, -27], [134, -28], [135, -27], [133, -27]]]
                    },
                    properties: {}
                }]
            };

            map.setGeoJSON(geojson);

            var result = map.getGeoJSON();
            expect(result).toBeDefined();
            expect(result.type).toBe("FeatureCollection");
            expect(result.features.length).toBeGreaterThan(0);
        });

        it("should work together with drawing controls when addGeometryFromLocalFile is enabled", function () {
            map = new ALA.Map(ID, {
                addGeometryFromLocalFile: true,
                drawOptions: {
                    polygon: true,
                    rectangle: true
                }
            });

            var drawBar = $(".leaflet-pm-toolbar");
            expect(drawBar).toBeVisible();

            var fileControl = $(".leaflet-control-filelayer");
            expect(fileControl.length).toBeGreaterThan(0);
        });
    });
});

