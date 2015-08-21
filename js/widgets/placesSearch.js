
var placesSearch = Class.create({

    init: function (constructor, map, commons, divId) {

        this.constructor = constructor;
        this.divId = divId;
        this.map = map;
        this.commons = commons;
        this.createPlaceSearch();
    },
    createPlaceSearch: function () {
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(this.divId));
        if (this.constructor.boundToMap) {
            this.autocomplete.bindTo('bounds', this.map);
        }

        google.maps.event.addListener(this.autocomplete, 'place_changed', $.proxy(this.placeChangHandler, this));
        google.maps.event.addListener(this.commons.marker, 'click', $.proxy(this.placeChangHandler, this));
    },
    markerClickHandler: function () {
        this.commons.infowindow.setContent('<div><strong>' + this.placeSearched.name + '</strong><br>' + this.placeAddress + '</div>');
        this.commons.infowindow.open(this.map, this.commons.marker);
    },
    placeChangHandler: function () {

        this.commons.infowindow.close();
        this.placeSearched = this.autocomplete.getPlace();

        if (this.placeSearched.geometry.viewport) {
            this.map.fitBounds(this.placeSearched.geometry.viewport);
        } else {
            this.map.setCenter(this.placeSearched.geometry.location);
            this.map.setZoom(17);  // Why 17? Because it looks good.
        }

        this.commons.setMarkerSymbol(this.placeSearched);
        this.commons.marker.setPosition(this.placeSearched.geometry.location);
        this.commons.marker.setVisible(true);

        this.placeAddress = this.commons.getAddressComponentForPlace(this.placeSearched);
        this.commons.infowindow.setContent('<div><strong>' + this.placeSearched.name + '</strong><br>' + this.placeAddress + '</div>');
        this.commons.infowindow.open(this.map, this.commons.marker);
    }

});