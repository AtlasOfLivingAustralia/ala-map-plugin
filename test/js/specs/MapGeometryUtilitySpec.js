describe("ALA.Map geometry utility tests", function () {
    var ID = "mapGeometryUtilityId";
    var html = "<div id='" + ID + "' data-leaflet-img='pathToLeafletImages' style='height:600px;width:100%'/>";

    function createMap() {
        return new ALA.Map(ID, {
            drawControl: false,
            defaultLayersControl: false,
            useMyLocation: false,
            allowSearchLocationByAddress: false,
            allowSearchRegionByAddress: false,
            showReset: false
        });
    }

    beforeEach(function () {
        $('#' + ID).remove();
        $(document.body).html(html);
    });

    afterEach(function () {
    });

    it("returns null when filtering self-intersecting features with invalid input", function () {
        var map = createMap();

        expect(map.filterOutSelfIntersectingFeatures(null)).toBeNull();
        expect(map.filterOutSelfIntersectingFeatures({})).toBeNull();
    });

    it("filters out only self-intersecting layers", function () {
        var map = createMap();
        var removed = [];
        var keptFeatureCollection = {
            type: "FeatureCollection",
            features: [{id: "valid-feature"}]
        };

        var validLayer = {id: "valid"};
        var invalidLayer = {
            id: "invalid",
            pm: {
                hasSelfIntersection: function () {
                    return true;
                }
            }
        };

        spyOn(L, "geoJSON").and.returnValue({
            eachLayer: function (callback) {
                callback(validLayer);
                callback(invalidLayer);
            },
            removeLayer: function (layer) {
                removed.push(layer);
            },
            toGeoJSON: function () {
                return keptFeatureCollection;
            }
        });

        var result = map.filterOutSelfIntersectingFeatures({type: "FeatureCollection", features: []});

        expect(removed.length).toBe(1);
        expect(removed[0]).toBe(invalidLayer);
        expect(result).toEqual(keptFeatureCollection);
    });

    it("rewinds only supported geometry types", function () {
        var map = createMap();

        var polygon = {
            type: "Feature",
            properties: {},
            geometry: {type: "Polygon", coordinates: [[[0, 0], [0, 1], [1, 0], [0, 0]]]}
        };
        var point = {
            type: "Feature",
            properties: {},
            geometry: {type: "Point", coordinates: [1, 1]}
        };

        var rewoundPolygon = map.rewindFeature(polygon);
        var unchangedPoint = map.rewindFeature(point);

        expect(rewoundPolygon).not.toBe(null);
        expect(unchangedPoint).toEqual(point);
    });

    it("assigns featureId to feature and layer and respects force option", function () {
        var map = createMap();
        var layer = {};
        var feature = {properties: {}};

        spyOn(UUID, "generate").and.returnValues("id-1", "id-2");

        map.assignFeatureId(layer, feature, false);
        expect(feature.properties.featureId).toBe("id-1");
        expect(layer.feature.properties.featureId).toBe("id-1");

        map.assignFeatureId(layer, feature, false);
        expect(feature.properties.featureId).toBe("id-1");

        map.assignFeatureId(layer, feature, true);
        expect(feature.properties.featureId).toBe("id-2");
        expect(layer.feature.properties.featureId).toBe("id-2");
    });

    it("generates a new unique featureId when the current one is already taken", function () {
        var map = createMap();
        var layer = {};
        var feature = {properties: {featureId: "duplicate-id"}};

        spyOn(map, "getDrawnItemsFeatureIds").and.returnValue({"duplicate-id": true});
        spyOn(UUID, "generate").and.returnValue("unique-id");

        map.assignFeatureId(layer, feature, false);

        expect(feature.properties.featureId).toBe("unique-id");
        expect(layer.feature.properties.featureId).toBe("unique-id");
    });

    it("repairs invalid polygon geojson when turf can repair it", function () {
        var map = createMap();

        var repairedFeature = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"valid":false},"geometry":{"type":"Polygon","coordinates":[[[0,0],[1,1],[1,0],[0,1],[0,0]]]}}]};

        var invalidFeatureCollection = {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                properties: {valid: false},
                geometry: {type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 1], [0, 0]]]}
            }]
        };

        var result = map.repairGeoJSON(invalidFeatureCollection);
        expect(result).not.toBeNull();
        expect(result.type).toBe("FeatureCollection");
        expect(result.features.length).toBe(2);
        expect(result.features[0]).not.toEqual(repairedFeature.features[0]);
    });

    it("returns null for null or empty feature collections", function () {
        var map = createMap();

        expect(map.repairGeoJSON(null)).toBeNull();
        expect(map.repairGeoJSON({type: "FeatureCollection", features: []})).toBeNull();
    });

    it("normalizes a valid feature input into a feature collection", function () {
        var map = createMap();
        var feature = {
            type: "Feature",
            properties: {name: "point"},
            geometry: {type: "Point", coordinates: [1, 1]}
        };

        var result = map.repairGeoJSON(feature);

        expect(result).not.toBeNull();
        expect(result.type).toBe("FeatureCollection");
        expect(result.features.length).toBe(1);
        expect(result.features[0]).toEqual(feature);
    });

    it("keeps valid features while repairing invalid polygons in the same collection", function () {
        var map = createMap();
        var featureCollection = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {id: "valid-point"},
                    geometry: {type: "Point", coordinates: [1, 1]}
                },
                {
                    type: "Feature",
                    properties: {id: "invalid-polygon", valid: false},
                    geometry: {type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 1], [0, 0]]]}
                }
            ]
        };

        var result = map.repairGeoJSON(featureCollection);

        expect(result).not.toBeNull();
        expect(result.type).toBe("FeatureCollection");
        expect(result.features.length).toBe(3);
        expect(result.features[0].properties.id).toBe("valid-point");
        expect(result.features[1].properties.id).toBe("invalid-polygon");
        expect(ALA.MapUtils.validateGeoJSON(result.features[1])).toBe(true);
    });

    it("keeps valid geometry while repairing invalid polygons in the same collection", function () {
        var map = createMap();
        var geometryCollection = {
            type: "GeometryCollection",
            geometries: [
                {
                    type: "Point",
                    coordinates: [1, 1]
                },
                {
                    type: "Polygon",
                    coordinates: [[[0, 0], [1, 1], [1, 0], [0, 1], [0, 0]]]
                }
            ]
        };

        var result = map.repairGeoJSON(geometryCollection);

        expect(result).not.toBeNull();
        expect(result.type).toBe("FeatureCollection");
        expect(result.features.length).toBe(1);
        expect(result.features[0].type).toBe("Feature");
        expect(result.features[0].geometry.type).toBe("GeometryCollection");
        expect(result.features[0].geometry.geometries.length).toBe(3);
        expect(result.features[0].geometry.geometries[0].type).toBe("Point");
        expect(result.features[0].geometry.geometries[1].type).toBe("Polygon");
        expect(result.features[0].geometry.geometries[2].type).toBe("Polygon");
    });

    it("validates nested GeoJSON by recursively checking child geometries", function () {
        var geoJSON = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {type: "Point", coordinates: [1, 1]}
                },
                {
                    type: "Feature",
                    geometry: {
                        type: "GeometryCollection",
                        geometries: [
                            {type: "Point", coordinates: [2, 2]},
                            {type: "Polygon", coordinates: [[[0, 0], [0, 1], [1, 0], [0, 0]]]}
                        ]
                    }
                }
            ]
        };

        var result = ALA.MapUtils.validateGeoJSON(geoJSON);

        expect(result).toBe(true);
    });

    it("validation fails when unknown geometries are found", function () {
        var geoJSON = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    geometry: {type: "Point", coordinates: [1, 1]}
                },
                {
                    type: "Feature",
                    geometry: {
                        type: "GeometryCollection",
                        geometries: [
                            {type: "Points", coordinates: [2, 2]},
                            {type: "Polygon", coordinates: [[[0, 0], [0, 1], [1, 0], [0, 0]]]}
                        ]
                    }
                }
            ]
        };

        var result = ALA.MapUtils.validateGeoJSON(geoJSON);

        expect(result).toBe(false);
    });

    it("returns false for unsupported GeoJSON types", function () {
        var result = ALA.MapUtils.validateGeoJSON({type: "UnsupportedType"});

        expect(result).toBe(false);
    });

    it("returns false when turf throws during geometry validation", function () {
        var result = ALA.MapUtils.validateGeoJSON({
            type: "Polygon",
            coordinates: [[[0, 0], [1, 1], [1, 0], [0, 1], [0, 0]]]
        });

        expect(result).toBe(false);
    });

    it("hides and shows layers using all supported layer APIs", function () {
        var map = createMap();

        var styleLayer = {
            setStyle: jasmine.createSpy("setStyle"),
            bringToFront: jasmine.createSpy("bringToFront")
        };
        var opacityLayer = {
            setOpacity: jasmine.createSpy("setOpacity")
        };
        var optionOnlyLayer = {
            options: {opacity: 0.5, weight: 4}
        };

        map.hideLayer(styleLayer);
        map.hideLayer(opacityLayer);
        map.hideLayer(optionOnlyLayer);

        expect(styleLayer.setStyle).toHaveBeenCalledWith({weight: 0, fillOpacity: 0});
        expect(opacityLayer.setOpacity).toHaveBeenCalledWith(0);
        expect(optionOnlyLayer.options.opacity).toBe(0);

        map.showLayer(styleLayer);
        map.showLayer(opacityLayer);
        map.showLayer(optionOnlyLayer);

        expect(styleLayer.setStyle).toHaveBeenCalledWith({weight: 4, fillOpacity: 0.5, color: "#000"});
        expect(styleLayer.bringToFront).toHaveBeenCalled();
        expect(opacityLayer.setOpacity).toHaveBeenCalledWith(0.5);
        expect(optionOnlyLayer.options.opacity).toBe(0.5);
        expect(optionOnlyLayer.options.weight).toBe(4);
    });
});

