describe("ALA.Map tests", function () {

    var ID = "mapId";
    var map;
    var html = "<div id='" + ID + "' data-leaflet-img='pathToLeafletImages' style='height:600px;width:100%'/>";

    beforeAll(function () {
        console.log("****** ALA.Map with default configuration ******");
    });

    afterAll(function () {
        console.log("----------------------------");
    });

    beforeEach(function () {
        $('#mapId').remove();
        $(document.body).html(html)
    });

    it("Should construct a new Leaflet Map when new ALA.Map() is invoked", function() {
        var map = new ALA.Map(ID);

        expect(map.getMapImpl()).toBeDefined();
    });

    it("should centre the new map on the default coordinates", function() {
        var map = new ALA.Map(ID);

        var centre = map.getCentre();

        expect(centre.lat).toBe(-28);
        expect(centre.lng).toBe(134);
    });

    it("should add the default drawing controls to a new map with default options", function() {
        new ALA.Map(ID);

        var drawBar = $(".leaflet-draw");
        expect(drawBar).toBeVisible();
        expect(drawBar.children().length).toBe(2); // draw controls and edit
        expect($(".leaflet-draw-draw-polygon")).toExist();
        expect($(".leaflet-draw-draw-rectangle")).toExist();
        expect($(".leaflet-draw-draw-circle")).toExist();
        expect($(".leaflet-draw-draw-marker")).toExist();
        expect($(".leaflet-draw-draw-polyline")).not.toExist();
    });

    it("should add the current lat/lng to a new map with the default options", function() {
        new ALA.Map(ID);

        expect($(".leaflet-control-coordinates")).toBeVisible();
    });

    it("should add extract the Leaflet image location from the data-leaflet-img attribute of the container div", function() {
        new ALA.Map(ID);

        expect(L.Icon.Default.imagePath).toBe("pathToLeafletImages");
    });

    it("should add the Use My Location control to a new map with the default options", function() {
        new ALA.Map(ID);

        expect($(".ala-map-my-location")).toExist();
    });

    it("should add the Search By Address control to a new map with the default options", function() {
        new ALA.Map(ID);

        expect($(".leaflet-control-geocoder")).toBeVisible();
    });

    it("should add the Reset Map control to a new map with the default options", function() {
        new ALA.Map(ID);

        expect($(".ala-map-reset")).toExist();
    });

    it("should keep a record of markers as they are added to the map", function() {
        var map = new ALA.Map(ID);

        map.addMarker(-28, 134);

        expect(map.getAllMarkers().length).toBe(1);
    });

    it("should remove existing markers when adding a new marker on a map with the default options", function() {
        var map = new ALA.Map(ID);

        map.addMarker(-28, 134);
        expect(map.getMarkerLocations().length).toBe(1);

        map.addMarker(-30, 130);

        expect(map.getMarkerLocations().length).toBe(1);
        expect(map.getMarkerLocations()[0].lat).toBe(-30);
        expect(map.getMarkerLocations()[0].lng).toBe(130);
    });

    it("should remove existing shapes when adding a new shape on a map with the default options", function() {
        var map = new ALA.Map(ID);

        var layer1 = L.circle([50.5, 30.5], 200);
        var layer2 = L.circle([-28.5, -30.5], 300);

        map.addLayer(layer1);
        expect(map.countFeatures()).toBe(1);

        map.addLayer(layer2);

        expect(map.countFeatures()).toBe(1);
        expect(map.getGeoJSON().features.length).toBe(1);
        expect(map.getGeoJSON().features[0].geometry.coordinates[0]).toBe(-30.5);
        expect(map.getGeoJSON().features[0].geometry.coordinates[1]).toBe(-28.5);
    });

    it("should remove existing layers when adding a new marker on a map with the defaut options", function() {
        var map = new ALA.Map(ID);

        var layer1 = L.circle([50.5, 30.5], 200);

        map.addLayer(layer1);
        expect(map.countFeatures()).toBe(1);
        expect(map.getMarkerLocations().length).toBe(0);

        map.addMarker(1, 1);
        expect(map.countFeatures()).toBe(1);
        expect(map.getMarkerLocations().length).toBe(1);
    });

    it("should not change map container height with default options", function() {
        var map = new ALA.Map(ID);
        expect($('#'+ID).height()).toBe(600);
    });
});