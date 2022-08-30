package au.org.ala.map.taglib

class MapTagLib {
    static namespace = "m"

    static final String DEFAULT_MAP_WIDTH = "650px"
    static final String DEFAULT_MAP_HEIGHT = "500px"

    static final String DEFAULT_FACETED_MAP_WIDTH = "100%"
    static final String DEFAULT_FACETED_MAP_HEIGHT = "600px"

    /**
     * Render a Map container.
     *
     * @attr id REQUIRED the unique ID for the map
     * @attr width The width for the map div. Optional - defaults to {@link #DEFAULT_MAP_WIDTH}
     * @attr height The height for the map div. Optional - defaults to {@link #DEFAULT_MAP_HEIGHT}
     * @attr imageLocation The leaflet image location - defaults to resource(dir: /vendor/leaflet/images, plugin: ala-map)
     */
    def map = { attrs ->
        // add file to work around an asset-pipeline crash
        String leafletImageLocation = attrs.imageLocation ?: "${assetPath(src: 'webjars/leaflet/1.6.0/dist/images/')}"
        String style = "width: ${attrs.width ?: DEFAULT_MAP_WIDTH}; height: ${attrs.height ?: DEFAULT_MAP_HEIGHT}"

        out << "<div id='${attrs.id}' style='${style}' data-leaflet-img='${leafletImageLocation}'></div>"
    }

    def occurrenceMap = { attrs ->
        // add file to work around an asset-pipeline crash
        String leafletImageLocation = attrs.imageLocation ?: "${assetPath(src: 'webjars/leaflet/1.6.0/dist/images/')}"
        String style = "width: ${attrs.width ?: DEFAULT_FACETED_MAP_WIDTH}; height: ${attrs.height ?: DEFAULT_FACETED_MAP_HEIGHT}"

        out << render(template: "/map/occurrenceMap", model: [id: attrs.id, style: style, leafletImageLocation: leafletImageLocation], plugin: "ala-map")
    }

}
