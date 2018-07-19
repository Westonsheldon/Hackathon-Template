var moment = require('moment-timezone');
module.exports = class parameter {
    constructor(obj) {
        this.param_id = obj.param_id;
        this.name   = obj.name;
        this.unit   = obj.unit;
        this.dataType = obj.dataType;
    }

    setDeviceId(id){
        this.device_id = id;
    }
}