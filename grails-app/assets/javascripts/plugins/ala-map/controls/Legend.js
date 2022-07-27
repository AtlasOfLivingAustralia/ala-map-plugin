/**
 * Custom Leaflet control which will display a legend for colour-coded values.
 *
 * <p/>
 * <b>Options:</b>
 * <ul>
 *     <li><code>id</code> Unique id for the control</li>
 *     <li><code>position</code> The location on the map (using leaflet's standard control positions). Default: bottomright</li>
 *     <li><code>collapse</code> True to show a button until clicked, then show the legendbox; false to just show the expanded legend box. Default: false</li>
 *     <li><code>label</code> The label to give to the list of legend colours, set to null for no label. Default: null</li>
 *     <li><code>title</code> The title the button when collapse=true. Default: 'Show legend'</li>
 *     <li><code>items</code> array of items to be displayed in the legend. Each item is an object with the following properties:
 *     <ul>
 *         <li><code>red</code>Red value for the RGB colour indicator<li>
 *         <li><code>green</code>Green value for the RGB colour indicator<li>
 *         <li><code>blue</code>Blue value for the RGB colour indicator<li>
 *         <li><code>name</code>The text to be displayed</li>
 *     </li>
 *     <li><code>iconClass</code> The CSS class(es) for the button icon (if collapse=true). Default: 'fa fa-list'</li>
 *     <li><code>legendListClass</code> The CSS class(es) legend list container. Default: none</li>
 * </ul>
 *
 * @class
 */
L.Control.Legend = L.Control.extend({
    options: {
        id: "replaceMe",
        position: "bottomright",
        collapse: false,
        label: null,
        title: "Show legend",
        items: [],
        iconClass: "fa fa-list",
        legendListClass: ""
    },

    initialize: function (options) {
        L.setOptions(this, options)
    },

    onAdd: function (map) {
        var self = this;
        self.map = map;

        self.id = self.options.id;
        var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

        self.icon = L.DomUtil.create("button", self.options.iconClass + " leaflet-bar-part " + (self.options.collapse ? "" : "hide"), container);
        self.icon.title = self.options.title;

        self.legend = L.DomUtil.create("div", "legend-container " + self.options.legendListClass + (self.options.collapse ? " hide" : ""), container);
        self.legend.id = self.options.id;

        self.setItems(self.options.items);

        if (self.options.collapse) {
            L.DomEvent.addListener(self.icon, 'click', function(event) {
                $(self.legend).toggleClass("hide");
                $(self.icon).toggleClass("hide");
                event.preventDefault();
            });
        }

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        return container;
    },

    setItems: function(items) {
        var self = this;
        self.clearItems();

        var close = L.DomUtil.create("button", "fa fa-times " + (self.options.position.indexOf("right") > -1 ? "pull-right" : ""), self.legend);
        close.title = "Hide legend";
        if (self.options.label) {
            var label = L.DomUtil.create("div", "legend-label", self.legend);
            label.textContent = self.options.label;
        }
        var list = L.DomUtil.create("ul", "legend", self.legend);

        L.DomEvent.addListener(close, 'click', function(event) {
            $(self.legend).toggleClass("hide");
            $(self.icon).toggleClass("hide");
            event.preventDefault();
        });

        items.forEach (function (item) {
            var li = L.DomUtil.create("li", "legend-item", list);
            var colour = L.DomUtil.create("span", "legend-colour", li);
            var text = L.DomUtil.create("span", "legend-text", li);
            $(colour).attr("style", "background-color: rgb(" + item.red + ", " + item.green + ", " + item.blue + ");");
            $(text).html(item.name);
        });
    },

    clearItems: function() {
        var self = this;

        while (self.legend.firstChild) {
            self.legend.removeChild(self.legend.firstChild);
        }
    },

    show: function() {
        var self = this;
        $(self.legend).removeClass("hide");
    },

    hide: function() {
        var self = this;
        $(self.legend).addClass("hide");
    }
});