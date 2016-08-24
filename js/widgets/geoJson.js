
var geoJson = Class.create({

    init: function (map) {
        this.map = map;
        this.initialize();
    },
    initialize: function () {
       
       this.st1 =  new google.maps.Data();
       this.st2 =  new google.maps.Data();
       this.st3 =  new google.maps.Data();
       
       st1.loadGeoJson('http://pri0ri7y.github.io/GMAPS100/assets/state.json');
       st2.loadGeoJson('http://pri0ri7y.github.io/GMAPS100/assets/state.json');
       st3.loadGeoJson('http://pri0ri7y.github.io/GMAPS100/assets/state.json');
       
    },
    exportOnclick:fuction(e){
      console.log(e);      
    }
    
});
