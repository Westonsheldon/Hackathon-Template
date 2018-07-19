// CONNECT TO ALL DATABASES
var path = require('path');
var sqlite3 = require('sqlite3');
const   mainDB_path = path.resolve(__dirname, '../../db/interactive_map.db')
var          mainDB = new sqlite3.Database(mainDB_path,'OPEN_READWRITE')

// Required Controllers
var deviceInfo = require('../modal/deviceInfo.js');

exports.devices = {};
exports.mindsphere = {};
exports.aspects = {};
exports.params ={};
exports.device_param = {};

// example structure of api
exports.devices.add = function(device){
  return new Promise(function(resolve,reject){

    const sqlCommand = `INSERT INTO device_info (name,type,last_update,mindsphere_assetId,mindsphere_parentId) values(?,?,?,?,?)`;
    const valsInject = [
      device.name,
      device.type,
      device.last_update,
      device.mindsphere_assetId,
      device.mindsphere_parentId
    ]
    mainDB.run(sqlCommand,valsInject, function(err) {
      if(err){
        if((''+ err).includes('device_info.mindsphere_assetId')){
          exports.devices.getInfo(device)
          .then(deviceInfo => {
            device.device_id = deviceInfo.device_id;
            resolve(device);
          })
        }else{
          resolve(device);
          //reject(err);
        }
      }else{
        device.device_id = this.lastID;
        resolve(device);
      }
    })
  })
};

exports.devices.getAll = function() {
  return new Promise(function(resolve, reject) {
    mainDB.all(`SELECT * FROM device_info`, function(err, devices) {
      if (err) {
        console.error(new Error(err))
        reject(err);
      }
      //Attach children object to each parent device
      /*
        note that this method only has two layers; parent and child. The reason
        is that the parent will be the data collector that the dcu will talk to
        and the children will be just slaves.
      */
      if(devices === undefined){
        return resolve([])
      }else if (!Array.isArray(devices)){
        devices = [devices]
      }
      devices.map(device => new deviceInfo(device))
      resolve(devices);
    })
  })
};

exports.params.add = function(param){
  return new Promise(function(resolve,reject){

    const sqlCommand = `INSERT INTO parameter (name,unit,dataType) values(?,?,?)`;
    const valsInject = [
      param.name,
      param.unit,
      param.dataType
    ]
    mainDB.run(sqlCommand,valsInject, function(err) {
      if(err){
        if((''+ err).includes('parameter.name')){
          exports.params.getInfo(param)
          .then(newParam => {
            param.param_id = newParam.param_id;
            resolve(param);
          })
        }else{
          reject(err)
        }
        
      }else{
        param.param_id = this.lastID;
        resolve(param);
      }
    })
  })
};
exports.params.getInfo = function(param){
  return new Promise(function(resolve,reject){
    if (typeof param.name === 'undefined') { reject({answer: null, body: 'param.name', error: 'missing key for input params'}) };
    mainDB.get(`SELECT * FROM parameter WHERE name =?`,[param.name],function(err,row){
      if(err){
        console.error(new Error(err))
        reject(err);
      }
      resolve(row);
    })
  })
};

exports.device_param.add = function(param){
  return new Promise(function(resolve,reject){
    const sqlCommand = `INSERT INTO device_param (device_id,param_id,feedback) values(?,?,?)`;
    const valsInject = [
      param.device_id,
      param.param_id,
      true
    ]
    mainDB.run(sqlCommand,valsInject, function(err) {
      if(err){
        reject(err)
      }else{
        resolve(param);
      }
    })
  })
};

exports.devices.getInfo = function(device){
  return new Promise(function(resolve,reject){
    if (typeof device.mindsphere_assetId === 'undefined') { reject({answer: null, body: 'mindsphere_assetId', error: 'missing key for input params'}) };
    mainDB.get(`SELECT * FROM device_info WHERE mindsphere_assetId=?`,[device.mindsphere_assetId],function(err,row){
      if(err){
        console.error(new Error(err))
        reject(err);
      }
      resolve(row);
    })
  })
};

exports.devices.delete = function(params){
  return new Promise(function(resolve,reject){

    if (typeof params.device_id === 'undefined') { reject({answer: null, body: 'params.device_id', error: 'missing key for input params'}) };

    mainDB.run(`DELETE FROM device_info WHERE id=${params.device_id} OR parent_id=${params.device_id}`,function(err){
      if(err){
        console.error(new Error(err))
        reject(err);
      }else{
        resolve();
      }
    })
  })
};

exports.aspects.add = function(aspect){
  return new Promise(function(resolve,reject){
    const sqlCommand = `INSERT INTO aspects (device_id, name, description, aspectTypeName, aspectTypeId,assetID_name) values(?, ?, ?, ?, ?, ?)`;
    const valsInject = [
      aspect.device_id,
      aspect.name,
      aspect.description,
      aspect.aspectTypeName,
      aspect.aspectTypeId,
      aspect.assetID_name
    ]
    mainDB.run(sqlCommand,valsInject, function(err) {
      if(err){
        reject(err)
      }else{
        aspect.aspect_id = this.lastID;
        resolve(aspect);
      }
    })
  })
};
exports.mindsphere.getAccounts = function() {
  return new Promise(function(resolve, reject) {
    mainDB.all(`SELECT * FROM mindsphere_login`,(err,row) => {
      err ? reject(err) : resolve(row);
    })
  });
}