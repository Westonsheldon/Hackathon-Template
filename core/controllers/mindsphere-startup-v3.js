const mindgate = require('./mindsphere-https-v3.js');
var moment = require('moment-timezone');

var DB_API = require('../db_api/db_api.js');
var deviceInfo = require('../modal/deviceInfo.js');
var aspectClass = require('../modal/aspect.js');

var tokenresult = {};

exports.initialize = function(tenant){

  return new Promise(function(resolve, reject) {
  
    DB_API.mindsphere.getAccounts()
    .then(accounts => {
      const mainAccount = accounts[0];
      const options = {
        username: mainAccount.username,
        password:mainAccount.password
      }
     return mindgate.get_token(options)
    })
    .then(tokenresponse => {
      tokenresult = JSON.parse(tokenresponse.body);
      // Bearer token for authentication
      const options = {
        bearertoken: tokenresult.access_token,
        pageSize: 1000,
      }
        // Get master assets
      return mindgate.get_asset(options);
    })
    .then(assetresponse => {
      const assetresult = JSON.parse(assetresponse.body);
      const filterAssets = assetresult["_embedded"]["assets"].filter(x => !x["deleted"] && x["typeId"])

      let promiseAssetArray = [];
      filterAssets.forEach(asset =>{
        let newAsset = new deviceInfo({
          name:asset.name,
          type:asset.typeId.split('_')[1],
          mindsphere_assetId:asset.assetId,
          mindsphere_parentId: asset.parentId
        })
        
        asset.variables.forEach(parameter => {
          newAsset.mindsphere_variables.push(parameter);
        })
        asset.aspects.forEach(aspect => {
          newAsset.addAspect(aspect);
        })
        promiseAssetArray.push(DB_API.devices.add(newAsset));
      })
      return Promise.all(promiseAssetArray)
    })
    .then(allAssets => {
      return new Promise((resolve,reject) =>{
        // options for accessing aspects
        console.log(`Found ${allAssets.length} assets`)
        let promiseAssetArray = [];
        console.log(`Begin Loading Aspects...`)
        allAssets.forEach(asset => {
          let options = {
            bearertoken: tokenresult.access_token,
            assetId: asset.mindsphere_assetId
          }
          mindgate.get_aspect(options)
          .then(aspectresponse => {
            const aspectresult = JSON.parse(aspectresponse.body)
            // Filter through aspect response for necessary info
            aspectresult["_embedded"]["aspects"].forEach(aspect => {
              asset.addAspect(aspect);
            })
            finalAspectHandler(asset);
          })
          .catch(err => {})
        })
      })
    })
  })
}

function finalAspectHandler(asset){
  let aspects = asset.aspects.filter(x => x.description != 'Device Heartbeat' && x.name !='status');
  aspects.forEach((aspect,ii) => {
    asset.aspects[ii] = new aspectClass({
      device_id: asset.device_id,
      name: aspect.name,
      description: aspect.description,
      aspectTypeName: aspect.aspectTypeName,
      aspectTypeId: aspect.aspectTypeId,
      assetID_name: asset.mindsphere_assetId + aspect.name
    })
  });
  console.log(asset);

  // aspects.forEach(aspect => {
  //   DB_API.aspects.add(aspect)
  // })
  //DB_API.aspects.add()
}
