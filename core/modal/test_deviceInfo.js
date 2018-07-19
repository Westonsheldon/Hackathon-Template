var deviceInfo = require('./deviceInfo.js');

var device = new deviceInfo({
    device_id: 5,
    name: 'test name',
    type: 'PAC4200'
});
device.setLocation({
    x: 100,
    y: 200
})
device.addParameter({
    param_id:10,
    name: 'Voltage a_n',
    unit: 'V'
})
device.addParameter({
    param_id:11,
    name: 'Voltage b_n',
    unit: 'V'
})

console.log(device)