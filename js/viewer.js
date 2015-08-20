var app = app || {};

app.viewer = {}; // viewer Object
 

/** Event Listener    **/
$(document).ready(function () {
    google.maps.event.addDomListener(window, 'load', app.viewer._init);    
});


/**  Viewer Definition   **/
app.viewer._init = function initialize() {

    // Map Object creation
    app.mapObject = new mapObject({
        center: new google.maps.LatLng(13.0827, 80.2707),
        scrollWheel: false,
        zoom: 13
    }, "map-canvas");


    // common Utils creation
    app.commonUtils = new commonUtils();




    // Places auto-complete creation
    app.placesSearch = new placesSearch({
        boundToMap: true
    }, "w1_freeSearch");


    //Search Nearby




}

