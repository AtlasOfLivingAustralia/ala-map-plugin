/*
 * Copyright (C) 2020 Atlas of Living Australia
 * All Rights Reserved.
 *
 * The contents of this file are subject to the Mozilla Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 * 
 * Created by Temi on 5/3/20.
 */

/*
 * Custom Leaflet control which will display a legend image produced by GeoServer.
 *
 * <p/>
 * <b>Options:</b>
 * <ul>
 *     <li><code>id</code> Unique id for the control</li>
 *     <li><code>position</code> The location on the map (using leaflet's standard control positions). Default: bottomright</li>
 *     <li><code>collapse</code> True to show a button until clicked, then show the legendbox; false to just show the expanded legend box. Default: false</li>
 *     <li><code>label</code> The label to give to the list of legend colours, set to null for no label. Default: null</li>
 *     <li><code>title</code> The title the button when collapse=true. Default: 'Show legend'</li>
 *     <li><code>iconClass</code> The CSS class(es) for the button icon (if collapse=true). Default: 'fa fa-list'</li>
 *     <li><code>legendListClass</code> The CSS class(es) legend list container. Default: none</li>
 * </ul>
 *
 * @class
 */
L.Control.LegendImage = L.Control.extend({
    options: {
        id: "replaceMe",
        position: "bottomright",
        title: 'Show legend',
        collapse: false,
        label: null,
        iconClass: "icon-list",
        legendListClass: "",
        url: "",
        width: null

    },

    initialize: function (options) {
        L.setOptions(this, options)
    },

    onAdd: function (map) {
        var self = this;
        self.map = map;

        self.id = self.options.id;
        var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");

        self.icon = L.DomUtil.create("button", " leaflet-bar-part " + (self.options.collapse ? "" : "hide"), container);
        self.icon.title = self.options.title;
        L.DomUtil.create("i", self.options.iconClass , self.icon);

        self.legend = L.DomUtil.create("div", "legend-container " + self.options.legendListClass + (self.options.collapse ? " hide" : ""), container);
        self.legend.style = 'width: 100%';
        self.legend.id = self.options.id;

        self.updateLegend();

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

    updateLegend: function (url) {
        var self = this;
        var url = url || self.options.url;
        self.clearLegend();

        if (url) {
            var spinner = L.DomUtil.create("span", "fa fa-spin fa-spinner", self.legend);
            var img = L.DomUtil.create("img", "image-logo hide " + (self.options.position.indexOf("right") > -1 ? "pull-right" : ""), self.legend);
            img.onload = function () {
                $(spinner).toggleClass('hide');
                $(img).toggleClass('hide');
            };
            img.src = url;
        }
    },

    clearLegend: function() {
        var self = this;

        while (self.legend.firstChild) {
            self.legend.removeChild(self.legend.firstChild);
        }
    }
});
