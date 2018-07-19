// CONNECT TO ALL DATABASES
var path = require('path')
var sqlite3 = require('sqlite3')
const   mainDB_path = path.resolve(__dirname, '../db/interactive_map.db')
var          mainDB = new sqlite3.Database(mainDB_path,'OPEN_READWRITE')

// Required Controllers
var deviceInfo = require('../controllers/index.js');

// example structure of api
exports.devices.add = function(params){
  return new Promise(function(resolve,reject){
    var device = new deviceInfo({
        device_id: null,
        name: params.name,
        type: params.type
    });

    const sqlCommand = `INSERT INTO device_info (name,type,last_update) values(${device.name},${device.type},${device.last_update})`;
    mainDB.run(sqlCommand, function(err,row) {
      if(err){
        console.error(new Error(err))
        reject(err);
      }else{
        device.device_id = this.lastID;
        resolve(device);
      }
    })
  })
};

exports.devices.delete = function(params){
  return new Promise(function(resolve,reject){

    if (typeof params.device_id === 'undefined') { reject({answer: null, body: 'device_id', error: 'missing key for input params'}) };

    mainDB.run(`DELETE FROM device_info WHERE id=${params.device_id} OR parent_id=${params.device_id}`,function(err,row){
      if(err){
        console.error(new Error(err))
        reject(err);
      }else{
        resolve();
      }
    })
  })
};