/** Prototype Extension **/

// circle contains method
google.maps.Circle.prototype.contains = function (latLng) {
    return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
}


   