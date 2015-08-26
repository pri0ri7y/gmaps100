var nearbySearch = Class.create({

    init: function (constructor, map, commons) {

        this.constructor = constructor;
        this.map = map;
        this.commons = commons;
        this.DirectionsRenderer = new google.maps.DirectionsRenderer();
        this.DirectionsRenderer.setPanel(document.getElementById(this.constructor.directionsPanel));

        this.placesTypeSync = { "ATM": "atm",
            "Bank": "bank",
            "Clinic": "doctor",
            "Hospital": "hospital",
            "Restaurant": "restaurant"
        }

        this.iconSync = { "ATM": "atm",
            "Bank": "bank",
            "Clinic": "clinic",
            "Hospital": "hospital",
            "Restaurant": "restaurant"
        }

    },
    onClickHandler: function () {

        this.latitude = $("#" + this.constructor.latitude).val();
        this.longitude = $("#" + this.constructor.longitude).val();
        this.category = $("#" + this.constructor.category).val();
        this.radius = $("#" + this.constructor.radius).val();
        $("#" + this.constructor.errorMessage).html("");

        // * creating the circle (overlay)
        if (this.circleOverlayObj != undefined) {
            this.circleOverlayObj.setMap(null);
        }

        var circleOptions = {
            strokeColor: '#191970',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#000000',
            fillOpacity: 0.15,
            map: this.map,
            center: new google.maps.LatLng(this.latitude, this.longitude),
            radius: this.radius * 1000
        };

        this.circleOverlayObj = new google.maps.Circle(circleOptions);
        var valBoolean = this.Validation([this.latitude, this.longitude, this.category, this.radius]);
        if (valBoolean) {
            this.PlacesRequestHandler([this.latitude, this.longitude, this.category, this.radius]);

            // * setting map to center
            this.map.setCenter(new google.maps.LatLng(this.latitude, this.longitude));
            this.map.fitBounds(this.circleOverlayObj.getBounds());
        }
    },
    Validation: function (arr) {

        var decimal = /^\d+\.\d{0,10}$/;  // regEx test for decimal upto 10 decimal places
        var number = /^-?\d+\.?\d*$/;     // regEx for signed numbers + float as well
        var datacheck1 = (decimal.test(arr[0]) || number.test(arr[0])) && (decimal.test(arr[1]) || number.test(arr[1])) && (decimal.test(arr[3]) || number.test(arr[3]));  // testing all the numeric inputs for their data type
        var datacheck2 = (arr[3] > 0 && arr[3] <= this.constructor.maxRadius); // testing if the radius inpu is > 0 & < 3 ( we are restricting the radial search to 3 km. )

        if (datacheck1 && datacheck2) { return true; }
        else {
            $("#" + this.constructor.errorMessage).html("Please enter the input properly for processing. For detailed functional description , read the documentation.");
            return false;
        }
    },
    PlacesRequestHandler: function (arr) {

        var request = {};
        var latlongobj = new google.maps.LatLng(arr[0], arr[1]);

        /** request params **/
        request.location = latlongobj;
        request.radius = arr[3] * 1000;
        request.query = arr[2];
        // request.types = app.NearBy.placesTypeSync[arr[2]];    //commented out because of poor results obtained in call back.
        this.commons.PlacesService.textSearch(request, $.proxy(this.PlacesCallbackHandler, this));

    },
    PlacesCallbackHandler: function (results, status) {
        switch (status) {
            case "OK":
                this.PlacesResultsDisplayHandler(results);
                this.DistanceMatrixRequestHandler(this.MarkersArray); // Distance Matrix Calculation
                break;

            case "ERROR":
                $("#" + this.constructor.errorMessage).html("There was a problem contacting the Google servers.");
                break;

            case "INVALID_REQUEST":
                $("#" + this.constructor.errorMessage).html("The request sent was invalid.");
                break;

            case "OVER_QUERY_LIMIT":
                $("#" + this.constructor.errorMessage).html("This webpage has gone over its request quota. Cannot fetch the results");
                break;

            case "REQUEST_DENIED":
                $("#" + this.constructor.errorMessage).html("he webpage is not allowed to use the PlacesService.");
                break;

            case "UNKNOWN_ERROR":
                $("#" + this.constructor.errorMessage).html("The PlacesService request could not be processed due to a server error. The request may succeed if you try again.");
                break;

            case "ZERO_RESULTS":
                $("#" + this.constructor.errorMessage).html("No result was found for this request.");
                break;
        }
    },
    PlacesResultsDisplayHandler: function (Results) {
        this.MarkerRemoveHandler(this.MarkersArray); // clearing all the overlays before adding new batch.
        this.MarkersArray = [];
        this.PlacesArray = [];
        this.PlacesArray = Results;

        for (var i = 0; i < Results.length; i++) {
            if (this.circleOverlayObj.contains(Results[i].geometry.location)) {
                this.PlacesResultsMarkerAddHandler(Results[i]);
            }
        }
    },
    PlacesResultsMarkerAddHandler: function (placeObject) {
        var marker = new google.maps.Marker({
            map: this.map,
            anchorPoint: new google.maps.Point(0, -29)
        }); //creating new marker object

        marker.setIcon(({
            url: "/GMAPS101/assets/images/markers/" + this.iconSync[this.category] + ".png",
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        })); //setting corresponding icon


        marker.setPosition(placeObject.geometry.location);
        marker.setVisible(true);
        this.MarkersArray.push(marker);
        google.maps.event.addListener(marker, 'click', $.proxy(this.PlacesResultsMarkerclickHandler, this));

    },
    PlacesResultsMarkerclickHandler: function (e) {
        var indexRes = JSLINQ(this.MarkersArray).Where(function (item) { return item.internalPosition == e.latLng; });
        var index = this.MarkersArray.indexOf(indexRes.items[0]);
        this.MarkersInfoWinAndRouteHandler(this.PlacesArray[index], index);
    },
    MarkerRemoveHandler: function (MarkersArray) {
        if (MarkersArray !== undefined) {
            for (var i = 0; i < MarkersArray.length; i++) {
                MarkersArray[i].setMap(null);
            }
        }
    },
    MarkersInfoWinAndRouteHandler: function (PlaceObj, index) {

        //Infowindow-Popup
        this.commons.PlacesService.getDetails(PlaceObj, $.proxy(function (result, status) {
            if (status != google.maps.places.PlacesServiceStatus.OK) {
                alert(status);
                return;
            }
            var address = this.commons.getAddressComponentForPlace(result);
            this.commons.infowindow.setContent('<div style="color: darkblue;"><strong>' + result.name + '</strong><br>' + address + "</div>");
            this.commons.infowindow.open(this.map, this.MarkersArray[index]);
        }, this));

        //Routing - Task
        // Directions Request Object Config
        var Request = {};
        Request.origin = new google.maps.LatLng(this.latitude, this.longitude);
        Request.destination = PlaceObj.geometry.location;
        Request.travelMode = google.maps.TravelMode.DRIVING;

        this.DirectionsRenderer.setMap(this.map);
        //app.NearBy.DirectionsRenderer.setPanel(document.getElementById('directions-panel'));

        this.commons.DirectionsService.route(Request, $.proxy(function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                this.DirectionsRenderer.setDirections(result);
            }
        }, this));
    },
    DistanceMatrixRequestHandler: function (MarkersArray) {
        //Creating Origin & Destination arrays
        var origins = [new google.maps.LatLng(this.latitude, this.longitude)];
        var destinations = this.DistanceMatrixDestinationsHandler(MarkersArray);

        // Distance Matrix Request Object.
        var Request = {};
        Request.avoidFerries = true;
        Request.avoidHighways = false;
        Request.avoidTolls = false;
        Request.travelMode = google.maps.TravelMode.DRIVING;
        Request.unitSystem = google.maps.UnitSystem.METRIC;
        Request.origins = origins;
        Request.destinations = destinations;
        this.commons.DistanceMatrixService.getDistanceMatrix(Request, $.proxy(this.DistanceMatrixCallBackHandler, this));

    },
    DistanceMatrixDestinationsHandler: function (MarkersArray) {
        var result = [];
        for (var i = 0; i < MarkersArray.length; i++) {
            result.push(MarkersArray[i].getPosition());
        }
        return result;
    },
    DistanceMatrixCallBackHandler: function (response, status) {
        if (status == "OK") {
            var distArray = [];
            for (var i = 0; i < response.rows[0].elements.length; i++) { distArray.push(parseFloat(response.rows[0].elements[i].distance.text.slice(0, -2))); }
            var shortest = Math.min.apply(Math, distArray);
            shortest = shortest + " km";

            var ResObj = JSLINQ(response.rows[0].elements).Where(function (item) { return item.distance.text == shortest; });
            var ResObjIndex = response.rows[0].elements.indexOf(ResObj.items[0]);

            this.MarkersInfoWinAndRouteHandler(this.PlacesArray[ResObjIndex], ResObjIndex);
        }
    }

});