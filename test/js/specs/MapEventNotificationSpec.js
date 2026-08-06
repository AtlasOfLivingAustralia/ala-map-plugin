describe("ALA.Map tests", function () {

    var ID = "mapId";
    var map;
    var html = "<div id='" + ID + "' data-leaflet-img='pathToLeafletImages'/>";

    beforeAll(function () {
        console.log("****** ALA.Map event notification test ******");
    });

    afterAll(function () {
        console.log("----------------------------");
    });

    beforeEach(function () {
        $('#mapId').remove();
        $(document.body).html(html)
    });

    it("should notify subscribers once when a new marker is added to the map", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.addMarker(1, 1);

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when a new layer is added to the map", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.addLayer(L.circle([1, 1], 100));

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when the map is reset", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.resetMap();

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when clearLayers is called", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.clearLayers();

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when clearMarkers is called", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.clearMarkers();

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when setGeoJSON is called", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        var json = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [125.6, 10.1]
            },
            "properties": {
                "name": "Dinagat Islands"
            }
        };

        map.setGeoJSON(json);

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when a pm:create event occurs with marker shape", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.getMapImpl().fire("pm:create", {
            shape: ALA.MapConstants.LAYER_TYPE.MARKER,
            layer: {
                on: function(){},
                addTo: function(){},
                getLatLng: function(){return new L.LatLng(1, 1)},
                options: {}
            }
        });

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when a pm:create event occurs with non-marker shape", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.getMapImpl().fire("pm:create", {
            shape: "polygon",
            layer: L.circle([1, 1], 100)
        });

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when pm:globaleditmodetoggled is disabled", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.getMapImpl().fire("pm:globaleditmodetoggled", {enabled: false});

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when pm:globalremovalmodetoggled is disabled", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.getMapImpl().fire("pm:globalremovalmodetoggled", {enabled: false});

        expect(notifyCount).toBe(1);
    });

    it("should notify subscribers once when addClusteredPoints is called", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.addClusteredPoints([{lat: 1, lng: 1}]);

        expect(notifyCount).toBe(1);
    });

    it("should NOT notify subscribers when fitBounds is called", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.fitBounds();

        expect(notifyCount).toBe(0);
    });

    it("should NOT notify subscribers when redraw is called", function() {
        var map = new ALA.Map(ID);
        var notifyCount = 0;

        map.subscribe(function() {
            notifyCount++;
        });

        map.redraw();

        expect(notifyCount).toBe(0);
    });
});
