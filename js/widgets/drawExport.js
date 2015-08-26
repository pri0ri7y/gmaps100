var drawExport = Class.create({
    init: function (constructor, map, commons) {
        this.constructor = constructor;
        this.map = map;
        this.commons = commons;        
        this.simplePointSymbol = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAZlBMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREApKScBAQEAAAAAAAAAAAAAAAAMDAsVFRQBAQEEBAQYGBcNDQwAAAAAAAAAAAAAAAABAQEBAQEtLSsXFxUAAAAAAAAEBAMEBATy9GVdAAAAHnRSTlMAAQQFAQkKAg0PFnXO+M1yCivW1isJccz2y3DSFCj80ZhLAAAAmUlEQVQYV22QMW4DMQwEZxgh58LO/z/pJrjCAi5YF5JyhyBsuBiwmCX8M86lSVYasGlyrHQ0gE2TvtIRR1JFfZl0hNa8eQdwd0+HQnUyv/LoDJjFzF0GzFAYVgIWSfc0FZrF8DvtNy0CnsxNU/Ps2nLCfbGfMgNuL78XeybHbJTbp6L1TDqIrV2+kd9GfxjyUecnlzN1cZnpDZRPYTtFFLTqAAAAAElFTkSuQmCC';

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
                fillColor: '#ffff00',
                fillOpacity: 1,
                strokeWeight: 5,
                clickable: false,
                editable: true
                
            }
        });
    },
    drawingController: function (bool) {
        if (bool) {
            //DOM content change for Deactivate
            var deactContent = "<a href='#' onclick= 'app.drawExport.drawingController(false);' >Deactivate Drawing Controls</a>";
            $("#" + this.constructor.drawingController).html(deactContent);

            this.drawingManager.setMap(this.map);
            this.drawingManager.drawingControl = bool;
            this.drawingManager.setDrawingMode(null);
        }
        else { 
            //DOM content change for Activate
            var actContent = "<a href='#' onclick= 'app.drawExport.drawingController(true);' >Activate Drawing Controls</a>";
            $("#" + this.constructor.drawingController).html(actContent);
            this.drawingManager.setMap(null);
            this.drawingManager.drawingControl = bool;
            this.drawingManager.setDrawingMode(null);
        }

    }
});