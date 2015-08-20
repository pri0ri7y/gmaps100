


var placesSearch = Class.create({

    init: function (constructor, divId) {
        this.constructor = constructor;
        this.divId = divId;
        this.createPlaceSearch();
    },
    createPlaceSearch: function () {
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(this.divId));       
        if(this.constructor.boundToMap){  
            this.autocomplete.bindTo('bounds', app.mapObject.map);
        }
    }

});