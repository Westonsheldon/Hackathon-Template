// Process socketIO events...
var moment = require('moment-timezone');
var classes = require('./classes/allClasses.js');

exports.startListening = function(server){
  var socketIO = require('socket.io')(server,{
    'pingTimeout': 15000,
  });
  //Subscribe to events...
  var push_events = require('./push_notifications.js').push_events;

  push_events.on('deviceOnline', device => {
    let timeStamp = moment().tz("UTC").format('YYYY-MM-DD HH:mm:ss');
    socketIO.emit('deviceOnline',JSON.stringify({
      title: `${device.name}`,
      message: `Device Online at ${timeStamp}`,
      device: device
    }))
  })

  push_events.on('deviceAdded', device => {
    socketIO.emit('deviceAdded',device)
  })

  push_events.on('deviceRemoved', device => {
    socketIO.emit('deviceRemoved',device)
  })

  push_events.on('polling_completed',device => {
    let timeStamp = moment().tz("UTC").format('YYYY-MM-DD HH:mm:ss');
    socketIO.emit('polling_completed',JSON.stringify({
      title: `${device.name}`,
      message: `Polling Completed at ${timeStamp}`,
      device: device
    }))
  })

  push_events.on('deviceOffline', device => {
    let timeStamp = moment().tz("UTC").format('YYYY-MM-DD HH:mm:ss');
    socketIO.emit('deviceOffline',JSON.stringify({
      title: `${device.name}`,
      message: `Device Offline at ${timeStamp}`,
      device: device
    }))
  })

  push_events.on('error', error => {
    let timeStamp = moment().tz("UTC").format('YYYY-MM-DD HH:mm:ss');
    socketIO.emit('error',JSON.stringify({
      'timestamp': timeStamp,
      'error':error
    }))
  })



  socketIO.on('requestDHCPdevices',() => {
    const netList = require('network-list');
    var networkDevices = [];
    netList.scan({}, (err, devices) => {
        devices = devices.filter(x => x.alive == true);
        socketIO.emit('RetrievedDHCPDevices',devices)
    });
    netList.scanEach({}, (err, device) => {
      if(device.alive) networkDevices.push(device);
    });
  })

  //For talking to user interface when it needs info from server
  socketIO.sockets.on('connection',function(socket){

    socket.on('getSerialPorts',function(cb){
      let SerialPort = require('serialport');
      SerialPort.list(function (err, ports) {
        if (err) {
          console.error(err)
          return
        }
        cb(ports);
      })
    })

    socket.on('requestSEM3Meters', function(controllerInfo,cb){

      var device = new classes.SEM3Controller({
        ip_address: controllerInfo.ip_address,  //'192.168.1.65'
        port:controllerInfo.port,               //80
        username: controllerInfo.username,      //'admin'
        password: controllerInfo.password       //'sem3'
      });

      device.login()
      .then(() => {
        console.log(device)
        return device.getMeters();
      })
      .then(() => {
        console.log('meters',device.meters)
        cb(null,device.meters)
      })
      .catch(err => {
        console.error(err)
        cb(err,null)
      })
    })
  })
}
