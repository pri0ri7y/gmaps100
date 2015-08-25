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
    app.commonUtils = new commonUtils(app.mapObject.map);


    // Places auto-complete creation
    app.placesSearch = new placesSearch({
        boundToMap: true
    }, app.mapObject.map, app.commonUtils, "w1_freeSearch");


    //Search Nearby
    app.nearbySearch = new nearbySearch({
        latitude: "w2_searchLatitude",
        longitude: "w2_searchLongitude",
        category: "w2_searchCategory",
        radius: "w2_searchRadius",
        errorMessage: "w2_searchErrorMessageDiv",
        directionsPanel: "w2_directionsPanel",
        maxRadius: 3
    }, app.mapObject.map, app.commonUtils);

    $("#w2_searchButton").on("click", function (e) { app.nearbySearch.onClickHandler(); });


    //Context Menu
    app.contextMenuController = new contextMenuController({
        nearBy: app.nearbySearch
    }, app.mapObject.map, app.commonUtils);




}

