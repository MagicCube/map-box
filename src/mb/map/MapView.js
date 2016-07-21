import AdaptiveMapView from "sap/a/map/MapView";
import TileLayer from "sap/a/map/layer/TileLayer";

import ServiceClient from "gd/service/ServiceClient";

import NaviLayer from "./layer/NaviLayer";

export default class MapView extends AdaptiveMapView
{
    afterInit()
    {
        super.afterInit();
        this.addStyleClass("mb-map-view");
    }

    initLayers()
    {
        this.tileLayer = new TileLayer({
            url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        });
        this.addLayer(this.tileLayer);

        this.naviLayer = new NaviLayer();
        this.addLayer(this.naviLayer);
    }

    searchRoute(startLocation, endLocation)
    {
        this.naviLayer.applySettings({
            startLocation,
            endLocation
        });
        this.naviLayer.fitBounds();

        ServiceClient.getInstance().searchDrivingRoute([ startLocation, endLocation ]).then(route => {
            this.naviLayer.drawRoute(route);
        });
    }
}
