
var geoJson = Class.create({

    init: function (map) {
        this.map = map;
        this.initialize();
    },
    initialize: function () {
       
       this.st1 =  new google.maps.Data();
       this.st2 =  new google.maps.Data();       
       
       this.st1.loadGeoJson('http://pri0ri7y.github.io/GMAPS100/assets/state.json');
       this.st2.loadGeoJson('http://pri0ri7y.github.io/GMAPS100/assets/district.json');      
       
    },
    exportOnclick: function(){
      var sel = $('#w4_layertype').val();
      
      switch(sel){
          
        case 'st1':
            this.st1.setMap(this.map);
            this.st2.setMap(null);             
            break;
        case 'st2':
            this.st1.setMap(null);
            this.st2.setMap(this.map);             
            break;
        default:
            break;
      }
    }
});
