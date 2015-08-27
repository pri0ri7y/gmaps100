var drawExport = Class.create({
    init: function (constructor, map, commons) {
        this.constructor = constructor;
        this.map = map;
        this.commons = commons;
        this.simplePointSymbol = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAZlBMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREApKScBAQEAAAAAAAAAAAAAAAAMDAsVFRQBAQEEBAQYGBcNDQwAAAAAAAAAAAAAAAABAQEBAQEtLSsXFxUAAAAAAAAEBAMEBATy9GVdAAAAHnRSTlMAAQQFAQkKAg0PFnXO+M1yCivW1isJccz2y3DSFCj80ZhLAAAAmUlEQVQYV22QMW4DMQwEZxgh58LO/z/pJrjCAi5YF5JyhyBsuBiwmCX8M86lSVYasGlyrHQ0gE2TvtIRR1JFfZl0hNa8eQdwd0+HQnUyv/LoDJjFzF0GzFAYVgIWSfc0FZrF8DvtNy0CnsxNU/Ps2nLCfbGfMgNuL78XeybHbJTbp6L1TDqIrV2+kd9GfxjyUecnlzN1cZnpDZRPYTtFFLTqAAAAAElFTkSuQmCC';
        this.drawingmode = null;
        this.drawGraphicsHolder = {
            marker: [],
            circle: [],
            polygon: [],
            polyline: [],
            rectangle: []
        };

        this.initializeDrawingOptions();

    },
    initializeDrawingOptions: function () {
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingControl: false,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                                google.maps.drawing.OverlayType.MARKER,
                                google.maps.drawing.OverlayType.CIRCLE,
                                google.maps.drawing.OverlayType.POLYGON,
                                google.maps.drawing.OverlayType.POLYLINE,
                                google.maps.drawing.OverlayType.RECTANGLE
                              ]
            },
            markerOptions: {
                draggable: true,
                icon: this.simplePointSymbol
            },
            circleOptions: {
                fillOpacity: 0.1,
                strokeWeight: 2,
                clickable: false,
                editable: true
            },
            polygonOptions: {
                fillOpacity: 0.1,
                strokeWeight: 2,
                clickable: false,
                editable: true
            },
            polylineOptions: {
                geodesic: true,
                editable: true,
                strokeWeight: 2
            },
            rectangleOptions: {
                fillOpacity: 0.1,
                strokeWeight: 2,
                clickable: false,
                editable: true
            }

        });

        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', $.proxy(this.overlayCompleteHandler, this));
    },
    drawingController: function (bool) {
        if (bool) {
            //DOM content change for Deactivate
            var deactContent = "<p><a href='#' onclick= 'app.drawExport.drawingController(false);' >Deactivate Drawing Controls</a></p>";
            $("#" + this.constructor.drawingController).html(deactContent);

            this.drawingManager.setMap(this.map);
            this.drawingManager.drawingControl = bool;
            this.drawingManager.setDrawingMode(null);
        }
        else {
            //DOM content change for Activate
            var actContent = "<p><a href='#' onclick= 'app.drawExport.drawingController(true);' >Activate Drawing Controls</a></p>";
            $("#" + this.constructor.drawingController).html(actContent);
            this.drawingManager.setMap(null);
            this.drawingManager.drawingControl = bool;
            this.drawingManager.setDrawingMode(null);
            this.drawingmode = null;
        }

    },
    overlayCompleteHandler: function (e) {
        this.drawGraphicsHolder[e.type].push(e);
    },
    clearGraphicsHandler: function () {

        for (var x = 0; x < Object.keys(this.drawGraphicsHolder).length; x++) {
            for (var i = 0; i < this.drawGraphicsHolder[Object.keys(this.drawGraphicsHolder)[x]].length; i++) {
                this.drawGraphicsHolder[Object.keys(this.drawGraphicsHolder)[x]][i].overlay.setMap(null);
            }
        }
        this.drawGraphicsHolder = {
            marker: [],
            circle: [],
            ploygon: [],
            polyline: [],
            rectangle: []
        };


    },
    export: function () {
        this.fMap = new google.maps.Map();
        this.FeatureCollection = [];
        var featuretype = $("#" + this.constructor.feature).val();
        this.constructor.exportType = $("#" + this.constructor.exportType).val();

        switch (featuretype) {

            case 'marker':
                for (var i = 0; i < this.drawGraphicsHolder['marker'].length; i++) {
                    var tempfeat = new google.maps.Data.Feature({ geometry: new google.maps.Data.Point(this.drawGraphicsHolder['marker'][i].overlay.getPosition()) });
                    this.fMap.data.add(tempfeat);
                }
                break;
            case google.maps.drawing.OverlayType.RECTANGLE:

                break;
            case google.maps.drawing.OverlayType.POLYGON:

                break;
            case google.maps.drawing.OverlayType.POLYLINE:

                break;
            case google.maps.drawing.OverlayType.CIRCLE:

                break;

        }

        this.fMap.getGeoJson(function (o) { console.log(o) });
    }
});


