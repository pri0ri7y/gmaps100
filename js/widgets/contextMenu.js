var contextMenuController = Class.create({

    init: function (constructor, map, commons) {
        this.constructor = constructor;
        this.map = map;
        this.commons = commons;
        this.createContextMenu();
        google.maps.event.addListener(this.map, "rightclick", $.proxy(this.contextRightClickHandler, this));
        google.maps.event.addListener(this.contextMenu, 'menu_item_selected', $.proxy(this.contextEventTrigger, this));
    },
    createContextMenu: function () {
        var contextMenuOptions = {};
        var menuItems = [];
        contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };

        /**   Menu Items getting appended -- starts here **/
        menuItems.push({ className: 'context_menu_item', eventName: 'evtClearGraphics', id: 'evtClearGraphics', label: 'Clear Graphics' });
        menuItems.push({ className: 'context_menu_item', eventName: 'evtUpdatePtInNearbySearch', id: 'evtUpdatePtInNearbySearch', label: 'Updat point in Nearby Search' });
        menuItems.push({});
        menuItems.push({ className: 'context_menu_item', eventName: 'evtZoomInClick', id: 'evtZoomInClick', label: 'Zoom in' });
        menuItems.push({ className: 'context_menu_item', eventName: 'evtZoomOutClick', id: 'evtZoomOutClick', label: 'Zoom out' });
        menuItems.push({});
        menuItems.push({ className: 'context_menu_item', eventName: 'evtCenterMapClick', id: 'evtCenterMapClick', label: 'Center map here' });
        /**   Menu Items getting appended -- ends here **/

        contextMenuOptions.menuItems = menuItems;
        this.contextMenu = new ContextMenu(this.map, contextMenuOptions);

    },
    contextRightClickHandler: function (event) {
        this.contextMenu.show(event.latLng);
    },
    contextEventTrigger: function (latLng, eventName) {

        switch (eventName) {

            case 'evtClearGraphics':
                
                break;

            case 'evtUpdatePtInNearbySearch':
                $("#" + this.constructor.nearBy.latitude).val();
                $("#" + this.constructor.nearBy.longitude).val();
               
                break;

            case 'evtZoomInClick':
                this.map.setZoom(this.map.getZoom() + 1);
                break;

            case 'evtZoomOutClick':
                this.map.setZoom(this.map.getZoom() - 1);
                break;

            case 'evtCenterMapClick':
                this.map.panTo(latLng);
                break;
        }
    }
});