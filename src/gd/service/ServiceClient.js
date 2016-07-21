import ManagedObject from "sap/ui/base/ManagedObject";

export default class ServiceClient extends ManagedObject
{
    metadata = {
        events: {
            ready: {}
        }
    };

    static _instance = null;
    static getInstance()
    {
        if (gd.service.ServiceClient._instance === null)
        {
            gd.service.ServiceClient._instance = new gd.service.ServiceClient();
        }
        return gd.service.ServiceClient._instance;
    }


    init()
    {
        AMap.service([ "AMap.Driving" ], () => {
            this.driving = new AMap.Driving();
            setTimeout(() => {
                this.fireReady();
            });
        });
    }

    searchDrivingRoute(locations)
    {
        return new Promise((resolve, reject) => {
            this.convertToGcj02(locations).then(locs => {
                this.driving.search(locs[0], locs[1], (status, result) => {
                    if (status === "complete" && result.info === "OK")
                    {
                        if (result.routes.length)
                        {
                            const route = result.routes[0];
                            route.steps.forEach(step => {
                                step.path = this.convertToWgs84(step.path);
                            });
                            resolve(route);
                        }
                        else
                        {
                            resolve(null);
                        }
                    }
                    else
                    {
                        reject({
                            status,
                            info: result.info
                        });
                    }
                });
            }, reject);
        });
    }

    convertToGcj02(locations)
    {
        return new Promise((resolve, reject) => {
            const locs = locations.map(location => {
                const latLng = L.latLng(location);
                return [ latLng.lng, latLng.lat ];
            });
            AMap.convertFrom(locs, "gps", (status, result) => {
                if (status === "complete" && result.info === "ok")
                {
                    resolve(result.locations);
                }
                else
                {
                    reject({
                        status,
                        info: result.info
                    });
                }
            });
        });
    }

    convertToWgs84(locations)
    {
        return locations.map(location => this._gcj2wgs(location.lat, location.lng));
    }






    _outOfChina(lat, lng) {
    	if ((lng < 72.004) || (lng > 137.8347)) {
    		return true;
    	}
    	if ((lat < 0.8293) || (lat > 55.8271)) {
    		return true;
    	}
    	return false;
    }

    _transformLat(x, y) {
    	var ret = -100.0 + 2.0*x + 3.0*y + 0.2*y*y + 0.1*x*y + 0.2*Math.sqrt(Math.abs(x));
    	ret += (20.0*Math.sin(6.0*x*Math.PI) + 20.0*Math.sin(2.0*x*Math.PI)) * 2.0 / 3.0;
    	ret += (20.0*Math.sin(y*Math.PI) + 40.0*Math.sin(y/3.0*Math.PI)) * 2.0 / 3.0;
    	ret += (160.0*Math.sin(y/12.0*Math.PI) + 320*Math.sin(y*Math.PI/30.0)) * 2.0 / 3.0;
    	return ret;
    }

    _transformLon(x, y) {
    	var ret = 300.0 + x + 2.0*y + 0.1*x*x + 0.1*x*y + 0.1*Math.sqrt(Math.abs(x));
    	ret += (20.0*Math.sin(6.0*x*Math.PI) + 20.0*Math.sin(2.0*x*Math.PI)) * 2.0 / 3.0;
    	ret += (20.0*Math.sin(x*Math.PI) + 40.0*Math.sin(x/3.0*Math.PI)) * 2.0 / 3.0;
    	ret += (150.0*Math.sin(x/12.0*Math.PI) + 300.0*Math.sin(x/30.0*Math.PI)) * 2.0 / 3.0;
    	return ret;
    }

    _delta(lat, lng) {
    	var a = 6378245.0;
    	var ee = 0.00669342162296594323;
    	var dLat = this._transformLat(lng-105.0, lat-35.0);
    	var dLng = this._transformLon(lng-105.0, lat-35.0);
    	var radLat = lat / 180.0 * Math.PI;
    	var magic = Math.sin(radLat);
    	magic = 1 - ee*magic*magic;
    	var sqrtMagic = Math.sqrt(magic);
    	dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * Math.PI);
    	dLng = (dLng * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
    	return {"lat": dLat, "lng": dLng};
    }

    _wgs2gcj(wgsLat, wgsLng) {
    	if (this._outOfChina(wgsLat, wgsLng)) {
    		return {"lat": wgsLat, "lng": wgsLng};
    	}
    	var d = this._delta(wgsLat, wgsLng);
    	return {"lat": wgsLat + d.lat, "lng": wgsLng + d.lng};
    }

    _gcj2wgs(gcjLat, gcjLng) {
    	if (this._outOfChina(gcjLat, gcjLng)) {
    		return {"lat": gcjLat, "lng": gcjLng};
    	}
    	var d = this._delta(gcjLat, gcjLng);
    	return {"lat": gcjLat - d.lat, "lng": gcjLng - d.lng};
    }
}
