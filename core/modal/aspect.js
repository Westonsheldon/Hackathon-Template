var moment = require('moment-timezone');
var parameter = require('./parameter.js');

module.exports = class aspect {
    constructor(obj) {
        this.device_id = obj.device_id;
        this.name = obj.name;
        this.description = obj.description;
        this.aspectTypeName = obj.aspectTypeName;
        this.aspectTypeId = obj.aspectTypeId;
        this.assetID_name = obj.assetID_name;
        this.params = [];
        this._lastUpdate();
    }

    _lastUpdate(){
        this.last_update = moment().utc().format();
    }
    addParam(asset){
        this.params.push(asset)
    }

    
}