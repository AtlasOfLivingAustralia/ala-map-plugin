/**
 * Custom Leaflet control which will display a select box. Selecing an item in the first box will populate the second.
 * Selecting an item in the second box will update the map.
 *
 * <p/>
 * <b>Options:</b>
 * <ul>
 *     <li><code>id</code> Unique id for the control</li>
 *     <li><code>position</code> The location on the map (using leaflet's standard control positions). Default: topleft</li>
 *     <li><code>collapse</code> True to show a button until clicked, then show the select box; false to just show the select box. Default: false</li>
 *     <li><code>label</code> The label for the select box (and the title the button when collapse=true). Default: 'Select...'</li>
 *     <li><code>items</code> array of items (key/value) to be displayed in the dropdown</li>
 *     <li><code>selectionAction</code> Function callback to invoke when the selection changes</li>
 *     <li><code>iconClass</code> The CSS class(es) for the button icon (if collapse=true). Default: 'fa fa-list'</li>
 *     <li><code>selectClass</code> The CSS class(es) for the select box. Default: 'leaflet-select'</li>
 * </ul>
 *
 * @class
 */
L.Control.Select = L.Control.extend({
    options: {
        id: "replaceMe",
        position: "topleft",
        collapse: false,
        title: "Select...",
        items: [],
        selectionAction: null,
        iconClass: "fa fa-list",
        selectClass: ""
    },

    select: null,

    initialize: function (options) {
        L.setOptions(this, options)
    },

    onAdd: function (map) {
        var self = this;
        self.map = map;

        self.id = self.options.id;
        var containerClassName = "select leaflet-bar leaflet-control";
        var container = L.DomUtil.create("div", containerClassName);
        container.id = self.options.id;
        var selectContainer = null;

        var createSelectContainer = function() {
            selectContainer = L.DomUtil.create("div", "selector-container " + (self.options.collapse ? "hide" : ""), container);
        };
        var createIcon = function() {
            self.icon = L.DomUtil.create("button", self.options.iconClass + " leaflet-bar-part", container);
        };

        if (self.options.collapse) {
            // The order is necessary - if the control is on the left side of the map then we need to show the button
            // before the select. If the control is on the right, then the button should be after the select.
            if (self.options.position.indexOf("right") > -1) {
                createSelectContainer();
                createIcon();
            } else {
                createIcon();
                createSelectContainer();
            }
            self.icon.title = self.options.label;
        } else {
            createSelectContainer();
            var label = L.DomUtil.create("label", "", selectContainer);
            label.innerHTML = self.options.label;
        }

        self.select = L.DomUtil.create("select", "selector", selectContainer);
        self.select.title = self.options.label;

        self.setItems(self.options.items);

        if (self.options.collapse) {
            L.DomEvent.addListener(self.icon, 'click', function (e) {
                e.preventDefault();
                $("#" + self.id + " .selector-container").toggleClass("hide inline-block")
            });
        }

        L.DomEvent.addListener(self.select, "change", function () {
            self.selectionChanged(self);
        }, self);

        L.DomEvent.disableClickPropagation(container);

        return container;
    },

    setItems: function(items, selectedItem, placeholder) {
        var self = this;
        self.clearItems();

        var placeholderItem = L.DomUtil.create("option", "", self.select);
        placeholderItem.value = "";
        placeholderItem.innerHTML = placeholder || "Select one...";

        if (items && items.length > 0) {
            items.forEach(function (item) {
                var option = L.DomUtil.create("option", "", self.select);
                if (item.key == selectedItem) {
                    option.selected = true;
                }
                option.value = item.key;
                option.innerHTML = item.value;
            });
        }
    },

    clearItems: function() {
        var self = this;

        while (self.select.firstChild) {
            self.select.removeChild(self.select.firstChild);
        }
    },

    selectionChanged: function (self) {
        var selection = $("#" + self.id + " .selector").val();
        self.options.selectionAction(selection, self.map);
        if (self.options.collapse) {
            $("#" + self.id + " .selectors").toggleClass("hide inline-block")
        }
    }
});