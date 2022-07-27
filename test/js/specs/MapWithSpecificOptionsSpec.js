describe("ALA.Map tests", function () {

    var ID = "mapId";
    var map;
    var html = "<div id='" + ID + "' data-leaflet-img='pathToLeafletImages' style='height:600px;width:100%'/>";

    beforeAll(function () {
        console.log("****** ALA.Map with specific configuration ******");
    });

    afterAll(function () {
        console.log("----------------------------");
    });

    beforeEach(function () {
        $('#mapId').remove();
        $(document.body).html(html)
    });


    it("should change map container height when trackWindowHeight is true", function() {
        var map = new ALA.Map(ID, {
            trackWindowHeight : true,
            minMapHeight: 300
        });

        expect($('#'+ID).height()).toBe(window.innerHeight - 40);
    });
});