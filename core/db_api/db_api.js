// CONNECT TO ALL DATABASES
var path = require('path')
var sqlite3 = require('sqlite3')
const   mainDB_path = path.resolve(__dirname, '../db/interactive_map.db')
var          mainDB = new sqlite3.Database(mainDB_path,'OPEN_READWRITE')

// example structure of api
exports.devices.getInfo = function(params){
  return new Promise(function(resolve,reject){
    if (typeof params.device_id === 'undefined') { reject({answer: null, body: 'device_id', error: 'missing key for input params'}) };
    mainDB.get(`SELECT * FROM devices WHERE id=?`,[params.device_id],function(err,row){
      if(err){
        console.error(new Error(err))
        reject(err);
      }
      resolve(row);
    })
  })
};