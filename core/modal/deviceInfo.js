var moment = require('moment-timezone');
var parameter = require('./parameter.js');

module.exports = class device {
    constructor(obj) {
        this.device_id = obj.device_id;
        this.name  = obj.name;
        this.type = obj.type;
        this.params = [];
        this.mindsphere_assetId = obj.mindsphere_assetId;
        this._lastUpdate();
    }

    setLocation(obj){
        this.location = {
            x: obj.x,
            y: obj.y,
            z: obj.z || 0
        };
        this._lastUpdate();
    }

    addParameter(obj){
        this.params.push(new parameter({
            param_id: obj.param_id,
            name: obj.name,
            unit: obj.unit
        }))
    }

    _lastUpdate(){
        this.last_update = moment().utc().format();
    }

    
}