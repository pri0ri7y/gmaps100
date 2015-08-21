


var mapObject = Class.create({

    init: function (constructor, divId) {
        this.constructor = constructor;
        this.divId = divId;
        this.createMapObject();
    },
    createMapObject: function () {
        this.map =  new google.maps.Map(document.getElementById(this.divId), this.constructor);
    }

});