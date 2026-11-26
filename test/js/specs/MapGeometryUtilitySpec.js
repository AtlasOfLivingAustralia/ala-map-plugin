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

        var rewoundPolygon = ALA.MapUtils.rewindFeature(polygon);
        var unchangedPoint = ALA.MapUtils.rewindFeature(point);

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
        var repairedFeature = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"valid":false},"geometry":{"type":"Polygon","coordinates":[[[0,0],[1,1],[1,0],[0,1],[0,0]]]}}]};

        var invalidFeatureCollection = {
            type: "FeatureCollection",
            features: [{
                type: "Feature",
                properties: {valid: false},
                geometry: {type: "Polygon", coordinates: [[[0, 0], [1, 1], [1, 0], [0, 1], [0, 0]]]}
            }]
        };

        var result = ALA.MapUtils.repairGeoJSON(invalidFeatureCollection);
        expect(result).not.toBeNull();
        expect(result.type).toBe("FeatureCollection");
        expect(result.features.length).toBe(2);
        expect(result.features[0]).not.toEqual(repairedFeature.features[0]);
    });

    it("returns null for null or empty feature collections", function () {
        expect(ALA.MapUtils.repairGeoJSON(null)).toBeNull();
        expect(ALA.MapUtils.repairGeoJSON({type: "FeatureCollection", features: []})).toBeNull();
    });

    it("normalizes a valid feature input into a feature collection", function () {
        var feature = {
            type: "Feature",
            properties: {name: "point"},
            geometry: {type: "Point", coordinates: [1, 1]}
        };

        var result = ALA.MapUtils.repairGeoJSON(feature);

        expect(result).not.toBeNull();
        expect(result.type).toBe("FeatureCollection");
        expect(result.features.length).toBe(1);
        expect(result.features[0]).toEqual(feature);
    });

    it("keeps valid features while repairing invalid polygons in the same collection", function () {
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

        var result = ALA.MapUtils.repairGeoJSON(featureCollection);

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

        var result = ALA.MapUtils.repairGeoJSON(geometryCollection);

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

    it("detects self-intersecting geometry", function () {
        var selfIntersectingPolygon = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Polygon",
                coordinates: [[[0, 0], [2, 2], [2, 0], [0, 2], [0, 0]]]
            }
        };

        var result = ALA.MapUtils.isSelfIntersecting(selfIntersectingPolygon);

        expect(result).toBe(true);
    });

    it("returns false for geometry without self-intersection", function () {
        var validPolygon = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "Polygon",
                coordinates: [[[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]]]
            }
        };

        var result = ALA.MapUtils.isSelfIntersecting(validPolygon);

        expect(result).toBe(false);
    });

    it("detects self-intersection in a feature collection", function () {
        var featureCollection = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {id: "valid"},
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]]]
                    }
                },
                {
                    type: "Feature",
                    properties: {id: "self-intersecting"},
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[0, 0], [2, 2], [2, 0], [0, 2], [0, 0]]]
                    }
                }
            ]
        };

        var result = ALA.MapUtils.isSelfIntersecting(featureCollection);

        expect(result).toBe(true);
    });

    it("returns false for a feature collection without self-intersections", function () {
        var featureCollection = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {id: "first"},
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]]]
                    }
                },
                {
                    type: "Feature",
                    properties: {id: "second"},
                    geometry: {
                        type: "Polygon",
                        coordinates: [[[3, 3], [3, 5], [5, 5], [5, 3], [3, 3]]]
                    }
                }
            ]
        };

        var result = ALA.MapUtils.isSelfIntersecting(featureCollection);

        expect(result).toBe(false);
    });

    it("detects self-intersection in a geometry collection", function () {
        var geometryCollection = {
            type: "GeometryCollection",
            geometries: [
                {
                    type: "Polygon",
                    coordinates: [[[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]]]
                },
                {
                    type: "Polygon",
                    coordinates: [[[0, 0], [2, 2], [2, 0], [0, 2], [0, 0]]]
                }
            ]
        };

        var result = ALA.MapUtils.isSelfIntersecting(geometryCollection);

        expect(result).toBe(true);
    });

    it("returns false for a geometry collection without self-intersections", function () {
        var geometryCollection = {
            type: "GeometryCollection",
            geometries: [
                {
                    type: "Polygon",
                    coordinates: [[[0, 0], [0, 2], [2, 2], [2, 0], [0, 0]]]
                },
                {
                    type: "Polygon",
                    coordinates: [[[3, 3], [3, 5], [5, 5], [5, 3], [3, 3]]]
                }
            ]
        };

        var result = ALA.MapUtils.isSelfIntersecting(geometryCollection);

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

    it("returns original geojson when coordinate count is at or below max points", function () {
        var geoJSON = {
            type: "Feature",
            properties: {},
            geometry: {type: "LineString", coordinates: [[0, 0], [1, 1]]}
        };

        spyOn(ALA.MapUtils, "validateGeoJSON");

        var result = ALA.MapUtils.simplifyToValidGeoJSON(geoJSON, 0.4, 3, 2, 2);

        expect(result).toBe(geoJSON);
        expect(ALA.MapUtils.validateGeoJSON).not.toHaveBeenCalled();
    });

    it("stops simplifying once validation succeeds", function () {
        var coordinates = [];
        for (var i = 0; i < 500; i++) {
            coordinates.push([i * 0.001, Math.sin(i * 0.01)]);
        }

        var geoJSON = {
            type: "Feature",
            properties: {},
            geometry: {type: "LineString", coordinates: coordinates}
        };

        spyOn(ALA.MapUtils, "validateGeoJSON").and.callFake(function () {
            return ALA.MapUtils.validateGeoJSON.calls.count() >= 2;
        });

        var result = ALA.MapUtils.simplifyToValidGeoJSON(geoJSON, 0.01, 4, 2, 200);

        expect(ALA.MapUtils.validateGeoJSON.calls.count()).toBe(2);
        expect(turf.coordAll(result).length).toBeLessThanOrEqual(turf.coordAll(geoJSON).length);
    });

    it("returns the original result when validation never succeeds", function () {
        var coordinates = [];
        for (var i = 0; i < 500; i++) {
            coordinates.push([i * 0.001, Math.sin(i * 0.01)]);
        }

        var geoJSON = {
            type: "Feature",
            properties: {},
            geometry: {type: "LineString", coordinates: coordinates}
        };

        spyOn(ALA.MapUtils, "validateGeoJSON").and.returnValue(false);

        var result = ALA.MapUtils.simplifyToValidGeoJSON(geoJSON, 0.01, 2, 2, 200);

        expect(ALA.MapUtils.validateGeoJSON.calls.count()).toBe(3);
        expect(result).toBe(geoJSON);
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

    it("removes internal properties from a feature and keeps other properties", function () {
        var map = createMap();
        var geoJSON = {
            type: "Feature",
            properties: {
                featureId: "f-1",
                tempSiteId: "t-1",
                siteId: "s-1",
                name: "Area 1",
                category: "A"
            },
            geometry: {
                type: "Point",
                coordinates: [134, -28]
            }
        };

        map.clearProperties(geoJSON);

        expect(geoJSON.properties.featureId).toBeUndefined();
        expect(geoJSON.properties.tempSiteId).toBeUndefined();
        expect(geoJSON.properties.siteId).toBeUndefined();
        expect(geoJSON.properties.name).toBe("Area 1");
        expect(geoJSON.properties.category).toBe("A");
    });

    it("removes provided properties from a feature and keeps other properties", function () {
        var map = createMap();
        var geoJSON = {
            type: "Feature",
            properties: {
                featureId: "f-1",
                tempSiteId: "t-1",
                siteId: "s-1",
                name: "Area 1",
                category: "A"
            },
            geometry: {
                type: "Point",
                coordinates: [134, -28]
            }
        };

        map.clearProperties(geoJSON, ["category"]);

        expect(geoJSON.properties.featureId).toBe("f-1");
        expect(geoJSON.properties.tempSiteId).toBe("t-1");
        expect(geoJSON.properties.siteId).toBe("s-1");
        expect(geoJSON.properties.name).toBe("Area 1");
        expect(geoJSON.properties.category).toBeUndefined();
    });

    it("removes internal properties from all features in a feature collection", function () {
        var map = createMap();
        var geoJSON = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {featureId: "f-1", siteId: "s-1", keep: "yes"},
                    geometry: {type: "Point", coordinates: [134, -28]}
                },
                {
                    type: "Feature",
                    properties: {tempSiteId: "t-2", keep: "still"},
                    geometry: {type: "Point", coordinates: [135, -29]}
                }
            ],
            properties: {
                collectionName: "Test Collection",
                siteId: "s-collection",
                tempSiteId: "t-collection",
                featureId: "f-collection"
            }
        };

        map.clearProperties(geoJSON);

        expect(geoJSON.features[0].properties.featureId).toBeUndefined();
        expect(geoJSON.features[0].properties.siteId).toBeUndefined();
        expect(geoJSON.features[0].properties.keep).toBe("yes");
        expect(geoJSON.features[1].properties.tempSiteId).toBeUndefined();
        expect(geoJSON.features[1].properties.keep).toBe("still");
        expect(geoJSON.properties.featureId).toBeUndefined();
        expect(geoJSON.properties.siteId).toBeUndefined();
        expect(geoJSON.properties.tempSiteId).toBeUndefined();
        expect(geoJSON.properties.collectionName).toBe("Test Collection");

    });

    it("does not fail when feature has no properties", function () {
        var map = createMap();
        var geoJSON = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [134, -28]
            }
        };

        expect(function () {
            map.clearProperties(geoJSON);
        }).not.toThrow();
        expect(geoJSON.properties).toBeUndefined();
    });
});
