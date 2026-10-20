describe("ALA.Map highlightFeaturesByProperty tests", function () {

    var ID = "mapId";
    var html = "<div id='" + ID + "' data-leaflet-img='pathToLeafletImages' style='height:600px;width:100%'/>";

    beforeEach(function () {
        $('#mapId').remove();
        $(document.body).html(html);
    });

    function getFeatureLayers(map) {
        var featureLayers = [];
        map.getMapImpl().eachLayer(function (layer) {
            if (layer && layer.eachLayer) {
                layer.eachLayer(function (child) {
                    if (child && child.feature && child.feature.properties) {
                        featureLayers.push(child);
                    }
                });
            }
        });
        return featureLayers;
    }

    function createGeoJson(features) {
        return {
            type: "FeatureCollection",
            features: features
        };
    }

    function polygonFeature(coordinates, properties) {
        return {
            type: "Feature",
            properties: properties,
            geometry: {
                type: "Polygon",
                coordinates: [coordinates]
            }
        };
    }

    it("should highlight only matching features by property", function () {
        var map = new ALA.Map(ID, {singleDraw: false, markerOrShapeNotBoth: false});

        var geoJson = createGeoJson([
            polygonFeature([[2, 2], [2, 3], [3, 3], [3, 2], [2, 2]], {category: "A"}),
            polygonFeature([[2, 2], [2, 3], [3, 3], [3, 2], [2, 2]], {category: "B"})
        ]);

        map.setGeoJSON(geoJson);

        var layers = getFeatureLayers(map);
        var matchingLayer = null;
        var nonMatchingLayer = null;

        layers.forEach(function (layer) {
            if (layer.feature.properties.category === "A") {
                matchingLayer = layer;
            } else if (layer.feature.properties.category === "B") {
                nonMatchingLayer = layer;
            }
        });

        spyOn(map, "highlightLayer").and.callThrough();
        spyOn(map, "unHighlightAllFeatures").and.callThrough();

        map.highlightFeaturesByProperty("category", "A");

        expect(map.unHighlightAllFeatures).toHaveBeenCalled();
        expect(map.highlightLayer).toHaveBeenCalledWith(matchingLayer);
        expect(map.highlightLayer).not.toHaveBeenCalledWith(nonMatchingLayer);
    });

    it("should highlight all matching features when multiple features match", function () {
        var map = new ALA.Map(ID, {singleDraw: false, markerOrShapeNotBoth: false});

        var geoJson = createGeoJson([
            polygonFeature([[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]], {category: "A"}),
            polygonFeature([[2, 2], [2, 3], [3, 3], [3, 2], [2, 2]], {category: "A"}),
            polygonFeature([[4, 4], [4, 5], [5, 5], [5, 4], [4, 4]], {category: "B"})
        ]);

        map.setGeoJSON(geoJson);

        var layers = getFeatureLayers(map);
        var matchingLayers = layers.filter(function (layer) {
            return layer.feature.properties.category === "A";
        });

        spyOn(map, "highlightLayer").and.callThrough();

        map.highlightFeaturesByProperty("category", "A");

        expect(map.highlightLayer.calls.count()).toBe(matchingLayers.length);
        matchingLayers.forEach(function (layer) {
            expect(map.highlightLayer).toHaveBeenCalledWith(layer);
        });
    });
});

