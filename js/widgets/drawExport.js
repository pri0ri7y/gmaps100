var drawExport = Class.create({
    init: function (constructor, map, commons) {
        this.constructor = constructor;
        this.map = map;
        this.commons = commons;
        this.simplePointSymbol = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAZlBMVEUAAABEREBEREBEREBEREBEREBEREBEREBEREBEREApKScBAQEAAAAAAAAAAAAAAAAMDAsVFRQBAQEEBAQYGBcNDQwAAAAAAAAAAAAAAAABAQEBAQEtLSsXFxUAAAAAAAAEBAMEBATy9GVdAAAAHnRSTlMAAQQFAQkKAg0PFnXO+M1yCivW1isJccz2y3DSFCj80ZhLAAAAmUlEQVQYV22QMW4DMQwEZxgh58LO/z/pJrjCAi5YF5JyhyBsuBiwmCX8M86lSVYasGlyrHQ0gE2TvtIRR1JFfZl0hNa8eQdwd0+HQnUyv/LoDJjFzF0GzFAYVgIWSfc0FZrF8DvtNy0CnsxNU/Ps2nLCfbGfMgNuL78XeybHbJTbp6L1TDqIrV2+kd9GfxjyUecnlzN1cZnpDZRPYTtFFLTqAAAAAElFTkSuQmCC';
        this.drawingmode = null;
        this.drawGraphicsHolder = {
            marker: [],
            polygon: [],
            polyline: []
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
                                google.maps.drawing.OverlayType.POLYGON,
                                google.maps.drawing.OverlayType.POLYLINE
                              ]
            },
            markerOptions: {
                draggable: true,
                icon: this.simplePointSymbol
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
            polygon: [],
            polyline: []
        };


    },
    export: function () {
        this.FeatureCollection = [];
        var featuretype = $("#" + this.constructor.feature).val();
        this.constructor.exportType = $("#" + this.constructor.exportType).val();

        switch (featuretype) {
            case 'marker':
                for (var i = 0; i < this.drawGraphicsHolder['marker'].length; i++) {
                    var pt = this.drawGraphicsHolder['marker'][i];
                    this.FeatureCollection.push(pt);
                }
                this.createGeoJson(this.FeatureCollection, 'marker');
                break;
            case 'polyline':
                for (var i = 0; i < this.drawGraphicsHolder['polyline'].length; i++) {
                    var ln = this.drawGraphicsHolder['polyline'][i];
                    this.FeatureCollection.push(ln);
                }
                this.createGeoJson(this.FeatureCollection, 'polyline');
                break;
            case 'polygon':
                for (var i = 0; i < this.drawGraphicsHolder['polygon'].length; i++) {
                    var pol = this.drawGraphicsHolder['polygon'][i];
                    this.FeatureCollection.push(pol);
                }
                this.createGeoJson(this.FeatureCollection, 'polygon');
                break;
        }

    },
    createGeoJson: function (fc, type) {
        this.GeoJson = { "type": "FeatureCollection",
            "features": []
        };

        if (type == 'marker') {
            for (var i = 0; i < fc.length; i++) {
                var pt = { "type": "Feature",
                    "geometry": { "type": "Point", "coordinates": [fc[i].overlay.position.lng(), fc[i].overlay.position.lat()] },
                    "properties": { "id": i
                    }
                };
                this.GeoJson['features'].push(pt);
            }
        }

        if (type == 'polyline') {
            for (var i = 0; i < fc.length; i++) {
                var f = fc[i].overlay.getPath().getArray()
                var coords = []
                for (var x = 0; x < f.length; x++) {
                    var coord = [f[x].lng(), f[x].lat()];
                    coords.push(coord);
                }

                var ln = { "type": "Feature",
                    "geometry": { "type": "LineString", "coordinates": coords },
                    "properties": { "id": i
                    }
                };

                this.GeoJson['features'].push(ln);
            }
        }

        if (type == 'polygon') {
            for (var i = 0; i < fc.length; i++) {
                var f = fc[i].overlay.getPath().getArray()
                var coords = []
                for (var x = 0; x <= f.length; x++) {
                    if (x == f.length) { var coord = [f[0].lng(), f[0].lat()]; }
                    else { var coord = [f[x].lng(), f[x].lat()]; }
                    coords.push(coord);
                }
                var ln = { "type": "Feature",
                    "geometry": { "type": "Polygon", "coordinates": [coords] },
                    "properties": { "id": i
                    }
                };
                this.GeoJson['features'].push(ln);
            }
        }

        var d = new Date();
        var GeoJsonData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.GeoJson));
        $('<a href="data:' + GeoJsonData + '" download="' + type + '_' + d + '.json">' + type + '_' + d + '</a><br/>').appendTo('#' + this.constructor.exportsDiv);

    },
    clearExportsDiv: function () {
        $('#' + this.constructor.exportsDiv).html("");
    }

});


