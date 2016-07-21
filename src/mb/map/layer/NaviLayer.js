import Layer from "sap/a/map/layer/Layer";

export default class NaviLayer extends Layer
{
    metadata = {
        properties: {
            startLocation: { type: "any" },
            endLocation: { type: "any" }
        }
    };

    init()
    {
        super.init();

        this.markerGroup = L.featureGroup();
        this.container.addLayer(this.markerGroup);
        this.routeGroup = L.featureGroup();
        this.container.addLayer(this.routeGroup);
    }

    afterInit()
    {
        super.afterInit();
    }

    setStartLocation(value)
    {
        const loc = L.latLng(value);
        this.setProperty("startLocation", loc);
        this._updateStartMarker();
    }

    setEndLocation(value)
    {
        const loc = L.latLng(value);
        this.setProperty("endLocation", loc);
        this._updateEndMarker();
    }


    drawRoute(route)
    {
        this.routeGroup.clearLayers();
        const multiPolyline = L.multiPolyline(route.steps.map(step => step.path));
        this.routeGroup.addLayer(multiPolyline);
    }

    _updateStartMarker()
    {
        if (!this.startMarker)
        {
            this.startMarker = L.circleMarker(this.getStartLocation(), 10);
            this.startMarker.setStyle({
                color: "green",
                opacity: 0.8,
                fillColor: "green",
                fillOpacity: 0.8
            });
            this.markerGroup.addLayer(this.startMarker);
        }
        else
        {
            this.startMarker.setLatLng(this.getStartLocation());
        }
    }

    _updateEndMarker()
    {
        if (!this.endMarker)
        {
            this.endMarker = L.circleMarker(this.getEndLocation(), 10);
            this.endMarker.setStyle({
                color: "red",
                opacity: 0.8,
                fillColor: "red",
                fillOpacity: 0.8
            });
            this.markerGroup.addLayer(this.endMarker);
        }
        else
        {
            this.endMarker.setLatLng(this.getEndLocation());
        }
    }
}
