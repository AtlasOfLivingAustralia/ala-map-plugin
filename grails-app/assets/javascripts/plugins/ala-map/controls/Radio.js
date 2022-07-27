/**
 * Created by Temi Varghese on 4/12/15.
 */
L.Control.Radio = L.Control.extend({
    options: {
        position: 'topright',
        title: 'click me',
        text: 'Radio: ',
        style: {
            height: '20px',
            padding: '5px'
        },
        /**
         * callback when checkbox is clicked.
         */
        onClick: null
    },

    _checkbox: null,

    initialize: function (options) {
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        var checkName = 'leaflet-control-checkbox leaflet-control-layers',
            container = L.DomUtil.create('div', checkName + ' leaflet-bar'),
            options = this.options;
        this._createButton(options.text, options.title, '', container, this.onClick)
        return container;
    },

    onClick: function (value) {
        this.options.onClick && this.options.onClick.apply(this, arguments);
    },

    onRemove: function (map) {

    },

    _createButton: function (html, title, className, container, fn) {
        var that = this, checked, radioHtml, radioDom,
            span;
        this._radios = []

        this.options.radioButtons.forEach(function(radio){
            var label = L.DomUtil.create('label', '', container);
            for (var i in that.options.style) {
                label.style[i] = that.options.style[i];
            }
            var radioHtml = '<input type="radio" name="' +
                that.options.name + '"' + (radio.checked ? ' checked="checked"' : '') + ' value="'+ radio.value +'"/>';
            label.innerHTML = radioHtml;
            label.innerHTML += '&nbsp;' +radio.displayName;
            radioDom = label.firstElementChild
            L.DomEvent
                .on(radioDom, 'mousedown dblclick', L.DomEvent.stopPropagation)
                .on(radioDom, 'click', function (e) {
                    that.onClick(that.getValue(e))
                }, that)
                .on(radioDom, 'click', that._refocusOnMap, that);

        })
    },

    getValue: function (e) {
        return e.target.value;
    }
});

L.control.zoom = function (options) {
    return new L.Control.Zoom(options);
};