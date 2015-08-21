


var contextMenuController = Class.create({

    init: function (constructor, map, commons) {
        this.constructor = constructor;
        this.map = map;
        this.commons = commons;
        this.createContextMenu();
        google.maps.event.addListener(this.map, "rightclick", $.proxy(this.contextRightClickHandler, this));
    },
    createContextMenu: function(){
        var contextMenuOptions = {};
        contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };
        
        var menuItems = [];
        menuItems.push({ className: 'context_menu_item', eventName: 'directions_origin_click', id: 'directionsOriginItem', label: 'Directions from here' });
        menuItems.push({ className: 'context_menu_item', eventName: 'directions_destination_click', id: 'directionsDestinationItem', label: 'Directions to here' });
        menuItems.push({ className: 'context_menu_item', eventName: 'clear_directions_click', id: 'clearDirectionsItem', label: 'Clear directions' });
        menuItems.push({ className: 'context_menu_item', eventName: 'get_directions_click', id: 'getDirectionsItem', label: 'Get directions' });
      
        menuItems.push({});
        menuItems.push({ className: 'context_menu_item', eventName: 'zoom_in_click', label: 'Zoom in' });
        menuItems.push({ className: 'context_menu_item', eventName: 'zoom_out_click', label: 'Zoom out' });
        menuItems.push({});
        menuItems.push({ className: 'context_menu_item', eventName: 'center_map_click', label: 'Center map here' });
        contextMenuOptions.menuItems = menuItems;

        this.contextMenu = new ContextMenu(this.map, contextMenuOptions);

    
    },
    contextRightClickHandler: function (event) {
        this.contextMenu.show(event.latLng);
    }


});