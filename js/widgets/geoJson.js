
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
    exportOnclick: function(){
      var sel = $('#w4_layertype').val();
      
      switch(sel){
          
        case 'st1':
            st1.setMap(map);
            st2.setMap(null);
            st3.setMap(null);
            break;
        case 'st2':
            st1.setMap(null);
            st2.setMap(map);
            st3.setMap(null);
            break;
        case 'st3':
            st1.setMap(null);
            st2.setMap(null);
            st3.setMap(map);
            break;
        default:
            break;
      }
    }
});
