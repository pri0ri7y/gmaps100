


var placesSearch = Class.create({

    init: function (constructor, divId) {
        that=this;

        this.constructor = constructor;
        this.divId = divId;
        this.createPlaceSearch();
        this.placeChangHandler();

    },

    createPlaceSearch: function () {
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(this.divId));       
        if(this.constructor.boundToMap){  
            this.autocomplete.bindTo('bounds', app.mapObject.map);
        }
    },
    placeChangHandler: function () {
    
       google.maps.event.addListener(this.autocomplete, 'place_changed', function () {  
              
         app.commonUtils.infowindow.close();
         that.placeSearched = that.autocomplete.getPlace();

         if (that.placeSearched.geometry.viewport) {
              app.mapObject.map.fitBounds(that.placeSearched.geometry.viewport);
          } else {
              app.mapObject.map.setCenter(that.placeSearched.geometry.location);
              app.mapObject.map.setZoom(17);  // Why 17? Because it looks good.
          }

         app.commonUtils.setMarkerSymbol(that.placeSearched);
         app.commonUtils.marker.setPosition(that.placeSearched.geometry.location);
         app.commonUtils.marker.setVisible(true);

         that.placeAddress = app.commonUtils.getAddressComponentForPlace(that.placeSearched);
         app.commonUtils.infowindow.setContent('<div><strong>' +
                                              '<div><i class="fa fa-globe fa-lg" style="float:right;" onClick="app.Geolocation.UpdateInfoInSearchForPlaces(this);" title="Update position in Nearby Search"> </i></div>' +
                                               that.placeSearched.name + 
                                              '</strong><br>' + that.placeAddress + '</div>');      
         app.commonUtils.infowindow.open(app.mapObject.map , app.commonUtils.marker);

       });
      
       google.maps.event.addListener(app.commonUtils.marker, 'click', function () {

         app.commonUtils.infowindow.setContent('<div><strong>' + that.placeSearched.name + '</strong><br>' + that.placeAddress);
         app.commonUtils.infowindow.open(app.mapObject.map, app.commonUtils.marker);

       });

    }

});