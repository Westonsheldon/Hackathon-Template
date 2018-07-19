var path = require("path");

const mindgate = require('./mindsphere-https-v3.js');
var schedule = require('node-schedule');
var moment = require('moment-timezone');
var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

// Create temporary database for storing session data
// TODO: Potentially store in memory? Look into functionality with MongoDb
// let db = new sqlite3.Database(__dirname + '/user-cache.db', {memory: true}, (err) => {
//   if (err) {
//     return console.error(err.message);
//   };
//   console.log('Connected to ' + __dirname + '/temp2.db');
//   db.open();
// });

var db = require('../../pac_gui.js').database;

exports.initialize = function(tenant){

  return new Promise(function(resolve, reject) {
    
    // Create table for assets and table for aspects
    db.run('CREATE TABLE if not exists assets(name, assetId, parentId, description, location, aspect)');
    db.run('CREATE TABLE if not exists aspects(assetId, aspectName, variables)');

    db.serialize(function() {

       // Options to get bearer token
      var options = {
        username: "AdminTechUserEMDS",
        password:"242fec67-45c7-432b-8567-19abf8767cd5"
      }

      // Get Token
      mindgate.get_token(options)
      .then(function (tokenresponse) {
        let tokenresult = JSON.parse(tokenresponse.body);
        
        // Bearer token for authentication
        let options = {
          bearertoken: tokenresult.access_token,
          pageSize: 1000,
        }

         // Get master assets
        mindgate.get_asset(options)
        .then(function (assetresponse) {
          let assetresult = JSON.parse(assetresponse.body);

          // Iterate through next pages incase size is not large enough to contain all assets
          while ((assetresult["page"]["totalPages"] - 1) !== assetresult["page"]["number"]) {
            let options = {
              bearertoken: tokenresult.access_token,
              pageSize: 1000,
              page: assetresult["page"]["number"] + 1,
            }

            mindgate.get_asset(options)
            .then(function (assetresponse) {
              let nextPageResult = JSON.parse(assetresponse.body);
              assetresult.push(nextPageResult);
            })
            .catch(message => {
              console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "\x1b[31m", message.error, 'body message: "', message.body, '"\x1b[37m');
              reject(Error(message));
            })
          }
          
          // Prepare submission into asset table
          var assetTable = db.prepare('INSERT INTO assets VALUES (?, ?, ?, ?, ?, ?)');

          // Filter through asset response for necessary info
          assetresult["_embedded"]["assets"].forEach(function(asset) {

            //Make sure asset has not been recently deleted
            if (!asset["deleted"]) {

              // options for accessing aspects
              let options = {
                bearertoken: tokenresult.access_token,
                assetId: asset["assetId"]
              }

              mindgate.get_aspect(options)
              .then(function (aspectresponse) {
                let aspectresult = JSON.parse(aspectresponse.body)

                // Prepare submission into aspect table
                var aspectTable = db.prepare('INSERT INTO aspects(assetId, aspectName, variables) VALUES (?, ?, ?)');
                
                // Filter through aspect response for necessary info
                aspectresult["_embedded"]["aspects"].forEach(function(aspect) {
                  var variables = new Array();
                  for (var i=0; i<aspect["variables"].length; i++) {
                    variables.push(aspect["variables"][i]["name"]);
                  }

                  // Initial Timeseries Data                    
                  options = {
                    bearertoken: tokenresult.access_token,
                    assetId: asset["assetId"],
                    aspectName: aspect["name"]
                  };

                  var match = tenant + '_PAC';
                  // Check to make sure is PAC meter for specific tenant
                  if (aspect["name"].match(match) != null) {
                    
                    // add asset data to table
                    assetTable.run(asset["name"], asset["assetId"], asset["parentId"], asset["description"], asset["location"], aspect["name"]);

                    // add aspect data to table
                    aspectTable.run(asset["assetId"], aspect["name"], variables.toString());

                    // Only create timeseries table for PAC meters
                    db.run('CREATE TABLE if not exists "'+ asset["assetId"] + '_' + aspect["name"] + '"(rowid, time, curr, ' + variables + ')');

                    // Take the last hour of data
                    var endTime;
                    mindgate.get_timeseries(options)
                    .then(function(timeResponse) {
                      let timeResult = JSON.parse(timeResponse.body);
                      if (timeResult[0] === undefined) {
                        db.run('DELETE FROM assets WHERE assetId="' + asset["assetId"] + '"');
                      } else {
                        endTime = timeResult[0]["_time"];

                        var startTime = moment(endTime).subtract(180, 'minutes');
                        console.log(moment(startTime).format('LLLL'));
                        console.log(moment(endTime).format('LLLL'));

                        // Create new API request with set hour time interval
                        options = {
                          bearertoken: tokenresult.access_token,
                          assetId: asset["assetId"],
                          aspectName: aspect["name"],
                          startTime: moment(startTime).toISOString(),
                          endTime: moment(endTime).toISOString()
                        };

                        var timeTable = db.prepare('INSERT INTO "'+ asset["assetId"] + '_' + aspect["name"] + '"(rowid, time, curr) VALUES (?, ?, ?)');
                        var rowid = 0;

                        // API request to get timeseries data
                        mindgate.get_timeseries(options)
                        .then(function(timeResponse){
                          db.serialize(function() {
                            let timeResult = JSON.parse(timeResponse.body);
                            timeResult.forEach(function(time) {
                              var variables = Object.keys(time);
                              var timeIndex = variables.indexOf("_time");
                              variables.splice(timeIndex, 1);
                              timeTable.run(rowid, time["_time"], JSON.stringify(variables));
                              rowid++;

                              //var varArray = new Array();
                              for (let i=0; i<variables.length; i++) {
                                var varValue = time[variables[i]];
                                //console.log(time[variables[i]]);
                                
                                db.run('UPDATE "'+ asset["assetId"] + '_' + aspect["name"] + '" SET "' + variables[i] + '"="' + time[variables[i]] + '" WHERE time="' + time["_time"] + '"', function(err) {
                                  if (err) {
                                    console.log(Error(err));
                                  } else {
                                    //console.log(variables[i] + ' ' + varValue);
                                    //console.log('UPDATE "'+ asset["assetId"] + '_' + aspect["name"] + '" SET "' + variables[i] + '"="' + time[variables[i]] + '", WHERE time="' + time["_time"] + '"');
                                  }
                                });
                              }
                            })
                          })
                        }).catch(message => { // Catch for get_timeseries for all data
                            console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "\x1b[31m", message.error, 'body message: "', message.body, '"\x1b[37m');
                            reject(Error(message));
                          }) 
                      }// End if timeResult != null

                    }).catch(message => { // Catch for get_timeseries for time interval
                        console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "\x1b[31m", message.error, 'body message: "', message.body, '"\x1b[37m');
                        reject(Error(message));
                      }) 
                  }
                })
              }).catch(message => { // Catch for get_aspect
                  console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "\x1b[31m", message.error, 'body message: "', message.body, '"\x1b[37m');
                  reject(Error(message));
                })
            }
          })
        }).catch(message => { // Catch for get_asset
            console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "\x1b[31m", message.error, 'body message: "', message.body, '"\x1b[37m');
            reject(Error(message));
          }) 
      }).catch(message => { // Catch for get_token
          console.log(moment().format("YYYY-MM-DD HH:mm:ss"), "\x1b[31m", message.error, 'body message: "', message.body, '"\x1b[37m');
          reject(Error(message));
        })
    })
  })
}

