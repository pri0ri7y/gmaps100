


var commonUtils = Class.create({

    init: function () {
        this.initializeElements();
    },

    initializeElements: function () {
        
        // Markers
        this.marker = new google.maps.Marker({
            map: app.mapObject.map,
            anchorPoint: new google.maps.Point(0, -29)
        });

        // InfoWindow
        this.infowindow = new google.maps.InfoWindow();

    },
    setMarkerSymbol: function (place) {

        this.marker.setIcon(({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
    },
    getAddressComponentForPlace: function (place) {
        var address = '';
        if (place.address_components) {
            address = [
            (place.address_components[0] && place.address_components[0].short_name || ''),
            (place.address_components[1] && place.address_components[1].short_name || ''),
            (place.address_components[2] && place.address_components[2].short_name || '')
          ].join(' ');
        }

        return address;
   }

});