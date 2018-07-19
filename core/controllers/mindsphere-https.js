//Version 0.3.0

const httpsRequest = require('request');
const URL = require('url').Url;
//const jwt = require('jwt-simple');
//const btoa = require('btoa'); //will be using Buffer().toString("base64") instead


var baseUrl = 'https://mindgate.appsdev.mindsphere.io';
var apiURL = new URL('https://mindgate.appsdev.mindsphere.io')

function apiRequestErrorHandling(error, answer, body) { //this handles all output from any api request. This will handle status code errors.
  return new Promise(function(resolve, reject) {
    let validStatusCode = (answer.statusCode < 300 && answer.statusCode >= 200);

    if (error) {
      reject({
        answer: answer,
        body: body,
        error: error
      })
    } else if (!validStatusCode) {
      reject({
        answer: answer,
        body: body,
        error: "statusCode Error " + answer.statusCode
      })
    } else if (!error && validStatusCode) {
      resolve({
        answer: answer,
        body: body,
        error: error //should be null in this case
      })
    }
  })
}


exports.get_token = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.applicationid === 'undefined') { reject({answer: null, body: 'applicationid', error: 'Input Error'}) }
    if (typeof params.clientSecret === 'undefined') { reject({answer: null, body: 'clientSecret', error: 'Input Error'}) }

    /*--------------------------------------------------------------------------------------
    This portion of the function strucutres and encodes the applicationid and clientSecret
    ----------------------------------------------------------------------------------------*/

    var stringToEncode = params.applicationid + ':' + params.clientSecret;
    var base64 = new Buffer(stringToEncode).toString('base64');
    var formdata = {grant_type: 'client_credentials'};

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.post({
            url: 'https://sag-pds0.3rdp-iamdev.mindsphere.io/oauth/token',
            headers: {
              'Authorization': 'Basic ' + base64,
              'Content-Type': 'application/json',
              'cache-control': 'no-cache',
              'content-type': 'application/x-www-form-urlencoded'
            },
            form: formdata
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.get_asset_filtered = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/
    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.filter === 'undefined') { reject({answer: null, body: 'filter', error: 'Input Error'}) }
    var path = '/api/assetmanagement/api/assets?filter='+encodeURIComponent(JSON.stringify(params.filter));
    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}


exports.get_asset = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }

    var path = '/api/AssetManagement/api/assets';

    if (typeof params.assetId !== 'undefined') { path += '/' + params.assetId; }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.post_asset = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetname === 'undefined') { reject({answer: null, body: 'assetname', error: 'Input Error'}) }
    if (typeof params.parentId === 'undefined') { reject({answer: null, body: 'parentId', error: 'Input Error'}) }
    if (typeof params.description === 'undefined') { reject({answer: null, body: 'description', error: 'Input Error'}) }
    if (typeof params.country === 'undefined') { reject({answer: null, body: 'country', error: 'Input Error'}) }
    if (typeof params.region === 'undefined') { reject({answer: null, body: 'region', error: 'Input Error'}) }
    if (typeof params.assetType === 'undefined') { params.assetType = ''}
    if (typeof params.assetidentifier === 'undefined') { params.assetidentifier = ''}
    if (typeof params.longitude === 'undefined') { params.longitude = ''}
    if (typeof params.latitude === 'undefined') { params.latitude = ''}
    if (typeof params.street === 'undefined') { params.street = ''}
    if (typeof params.houseNo === 'undefined') { params.houseNo = ''}
    if (typeof params.city === 'undefined') { params.city = ''}
    if (typeof params.postalcode === 'undefined') { params.postalcode = ''}
    if (typeof params.district === 'undefined') { params.district = ''}

    var path = '/api/AssetManagement/api/assets';

    /*--------------------------------------------------------------------------------------
    This portion of the function creates a timeseries object with require properties.
    JSON Structure of Object:
    {
      "assetType": "string",
      "description": "string",
      "identifier": "string",
      "location": {
        "street": "string",
        "houseNo": "string",
        "city": "string",
        "postalcode": "string",
        "country": "string",
        "district": "string",
        "region": "string",
        "latitude": 0,
        "longitude": 0
      },
      "name": "string",
      "parentId": "string"
    }
    ----------------------------------------------------------------------------------------*/
    var assetlocation = {
      street: params.street,
      houseNo: params.houseNo,
      city: params.city,
      postalcode: params.postalcode,
      country: params.country,
      district: params.district,
      region: params.region ,
      latitude: params.latitude,
      longitude: params.longitude
    }

    var assetbody = {
      assetType: params.assetType,
      description: params.description,
      identifier: params.assetidentifier,
      location: JSON.parse(JSON.stringify(assetlocation)),
      name: params.assetname,
      parentId: params.parentId
    }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.post({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(assetbody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.update_asset = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetname === 'undefined') { reject({answer: null, body: 'assetname', error: 'Input Error'}) }
    if (typeof params.assetId === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }
    if (typeof params.parentId === 'undefined') { reject({answer: null, body: 'parentId', error: 'Input Error'}) }
    if (typeof params.description === 'undefined') { reject({answer: null, body: 'description', error: 'Input Error'}) }
    if (typeof params.country === 'undefined') { reject({answer: null, body: 'country', error: 'Input Error'}) }
    if (typeof params.region === 'undefined') { reject({answer: null, body: 'region', error: 'Input Error'}) }
    if (typeof params.assetType === 'undefined') { params.assetType = ''}
    if (typeof params.assetidentifier === 'undefined') { params.assetidentifier = ''}
    if (typeof params.longitude === 'undefined') { params.longitude = ''}
    if (typeof params.latitude === 'undefined') { params.latitude = ''}
    if (typeof params.street === 'undefined') { params.street = ''}
    if (typeof params.houseNo === 'undefined') { params.houseNo = ''}
    if (typeof params.city === 'undefined') { params.city = ''}
    if (typeof params.postalcode === 'undefined') { params.postalcode = ''}
    if (typeof params.district === 'undefined') { params.district = ''}

    var path = '/api/AssetManagement/api/assets/' + params.assetId;

    /*--------------------------------------------------------------------------------------
    This portion of the function creates a timeseries object with require properties.
    JSON Structure of Object:
    {
      "assetType": "string",
      "description": "string",
      "identifier": "string",
      "location": {
        "street": "string",
        "houseNo": "string",
        "city": "string",
        "postalcode": "string",
        "country": "string",
        "district": "string",
        "region": "string",
        "latitude": 0,
        "longitude": 0
      },
      "name": "string",
      "parentId": "string"
    }
    ----------------------------------------------------------------------------------------*/
    var assetlocation = {
      street: params.street,
      houseNo: params.houseNo,
      city: params.city,
      postalcode: params.postalcode,
      country: params.country,
      district: params.district,
      region: params.region ,
      latitude: params.latitude,
      longitude: params.longitude
    }

    var assetbody = {
      assetId: params.assetId,
      assetType: params.assetType,
      description: params.description,
      identifier: params.assetidentifier,
      location: assetlocation,
      name: params.assetname,
      parentId: params.parentId
    }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.put({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(assetbody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.delete_asset = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }

    var path = '/api/AssetManagement/api/assets/' + params.assetId;

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.delete({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.get_asset_children = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/
    let path = '/api/AssetManagement/api/assets/'+params.assetId+'/children';
    var page_assetResources = [];
    (function nextPage(index,nextURL){
      httpsRequest.get({
        url:nextURL,
        headers: {
          'Authorization': 'Bearer ' + params.bearertoken,
          'Content-Type': 'application/json'
        }
      },function(error,answer,body){
        if(error){
          reject(error)
        }
        let bodyParsed = JSON.parse(body);
        page_assetResources = page_assetResources.concat(bodyParsed._embedded.assetResources)
        if(typeof bodyParsed._links.next == 'undefined'){
          apiRequestErrorHandling(error, answer, body)
          .then(function(answer){
            answer.page_assetResources = page_assetResources;
            resolve(answer)
          })
          .catch(function(answer){
            reject(answer)
          })
        }else{
          //console.log(bodyParsed._links.next)
          nextURL = bodyParsed._links.next.href;
          nextPage(index+1,nextURL)
        }
        //console.log('page_assetResources',page_assetResources)

      });
    })(0,baseUrl + path)

  //End Promise
  })

//End Function
}

exports.get_aspect = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/
    console.log(params)
    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }

    var path = '/api/AssetManagement/api/assets/' + params.assetId + '/aspects'

    if (typeof params.aspectName !== 'undefined') { path += '/' + params.aspectName; }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/
    console.log(baseUrl + path)
    'https://mindgate.appsdev.mindsphere.io/api/assetmanagement/api/assets/00DAF015819A468BB90A48B48006C450/aspects'
    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.post_aspect = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken     === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId         === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }
    if (typeof params.aspectName      === 'undefined') { reject({answer: null, body: 'aspectName', error: 'Input Error'}) }
    if (typeof params.variables       === 'undefined') { reject({answer: null, body: 'variableName', error: 'Input Error'}) }

    if(!Array.isArray(params.variables)){params.variables = [params.variables]}
    params.variables.forEach(function(variable,index){
      if(typeof variable.onDateChange === 'undefined') { reject({answer: null, body: 'variables['+index+'].onDateChange', error: 'Missing Parameter'}) }
      if(typeof variable.variableName === 'undefined') { reject({answer: null, body: 'variables['+index+'].variableName', error: 'Missing Parameter'}) }
      //if(typeof variable.unit         === 'undefined') { reject({answer: null, body: 'variables['+index+'].unit',         error: 'Missing Parameter'}) }
      if(typeof variable.dataFormat   === 'undefined') { reject({answer: null, body: 'variables['+index+'].dataFormat',   error: 'Missing Parameter'}) }
    })
    if (typeof params.active          === 'undefined') { params.active = true}
    if (typeof params.readingCycle    === 'undefined') { params.readingCycle = 0}
    if (typeof params.transferCycle   === 'undefined') { params.transferCycle = 0}
    if (typeof params.bufferSize      === 'undefined') { params.bufferSize = 100}
    if (typeof params.uploadChannel   === 'undefined') { params.uploadChannel = ''}

    var path = '/api/AssetManagement/api/assets/' + params.assetId + '/aspects';

    /*--------------------------------------------------------------------------------------
    This portion of the function creates a timeseries object with require properties.
    JSON Structure of Object:
    {
      "aspectName": "string",
      "active": true,
      "readingCycle": 0,
      "transferCycle": 0,
      "bufferSize": 0,
      "uploadChannel": "string",
      "variables": [
        {
          "onDataChanged": true,
          "variableName": "string",
          "unit": "string",
          "dataFormat": "string"
        }
      ]
    }
    ----------------------------------------------------------------------------------------*/

    let aspectbody = {
      aspectName:     params.aspectName,
      active:         params.active,
      readingCycle:   params.readingCycle,
      transferCycle:  params.transferCycle,
      bufferSize:     params.bufferSize,
      uploadChannel:  params.uploadChannel,
      variables:      params.variables
    }
    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.post({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(aspectbody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.update_aspect = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken     === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId         === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }
    if (typeof params.aspectName      === 'undefined') { reject({answer: null, body: 'aspectName', error: 'Input Error'}) }
    if (typeof params.variables       === 'undefined') { reject({answer: null, body: 'variableName', error: 'Input Error'}) }

    if(!Array.isArray(params.variables)){params.variables = [params.variables]}
    params.variables.forEach(function(variable,index){
      if(typeof variable.onDateChange === 'undefined') { reject({answer: null, body: 'variables['+index+'].onDateChange', error: 'Missing Parameter'}) }
      if(typeof variable.variableName === 'undefined') { reject({answer: null, body: 'variables['+index+'].variableName', error: 'Missing Parameter'}) }
      if(typeof variable.unit         === 'undefined') { reject({answer: null, body: 'variables['+index+'].unit',         error: 'Missing Parameter'}) }
      if(typeof variable.dataFormat   === 'undefined') { reject({answer: null, body: 'variables['+index+'].dataFormat',   error: 'Missing Parameter'}) }
    })
    if (typeof params.active          === 'undefined') { params.active = true}
    if (typeof params.readingCycle    === 'undefined') { params.readingCycle = 0}
    if (typeof params.transferCycle   === 'undefined') { params.transferCycle = 0}
    if (typeof params.bufferSize      === 'undefined') { params.bufferSize = 0}
    if (typeof params.uploadChannel   === 'undefined') { params.uploadChannel = ''}
    if (typeof params.onDataChanged   === 'undefined') { params.onDataChanged = true}

    var path = '/api/AssetManagement/api/assets/' + params.assetId + '/aspects';
    /*--------------------------------------------------------------------------------------
    This portion of the function creates a timeseries object with require properties.
    JSON Structure of Object:
    {
      "aspectName": "string",
      "active": true,
      "readingCycle": 0,
      "transferCycle": 0,
      "bufferSize": 0,
      "uploadChannel": "string",
      "variables": [
        {
          "onDataChanged": true,
          "variableName": "string",
          "unit": "string",
          "dataFormat": "string"
        }
      ]
    }
    ----------------------------------------------------------------------------------------*/

    var aspectbody = {
      aspectName:     params.aspectName,
      active:         params.active,
      readingCycle:   params.readingCycle,
      transferCycle:  params.transferCycle,
      bufferSize:     params.bufferSize,
      uploadChannel:  params.uploadChannel,
      variables:      params.variables
    }
    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.put({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(aspectbody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.delete_aspect = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }

    var path = '/api/AssetManagement/api/assets/' + params.assetId + '/aspects'

    if (typeof params.aspectName !== 'undefined') { path += '/' + params.aspectName; }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.delete({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.post_timeseries = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/
    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId     === 'undefined') { reject({answer: null, body: 'assetId',     error: 'Input Error'}) }
    if (typeof params.aspectName  === 'undefined') { reject({answer: null, body: 'aspectName',  error: 'Input Error'}) }
    if(!Array.isArray(params.variables)){params.variables = [params.variables]}
    params.variables.forEach(function(variable,index){
      if(typeof variable.aspectName === 'undefined') { variable.aspectName = params.aspectName}
      if(typeof variable.name       === 'undefined') { reject({answer: null, body: 'variables['+index+'].name',       error: 'Missing Parameter'}) }
      if(typeof variable.status     === 'undefined') { variable.status = "Online" }
      if(typeof variable.thingId    === 'undefined') { params.thingId = params.assetId }
      if(typeof variable.timestamp  === 'undefined') { reject({answer: null, body: 'variables['+index+'].timestamp',  error: 'Missing Parameter'}) }
      if(typeof variable.value      === 'undefined') { reject({answer: null, body: 'variables['+index+'].value',      error: 'Missing Parameter'}) }
    })
    var path = '/api/timeseries/api/timeseries';
    /*--------------------------------------------------------------------------------------
    This portion of the function creates a timeseries object with require properties.
    JSON Structure of Object:
    [
      {
        "aspectName": "string",
        "name": "string",
        "status": "string",
        "thingId": "string",
        "timestamp": "2018-02-13T14:04:59.932Z",
        "value": "string"
      }
    ]
    ----------------------------------------------------------------------------------------*/
    var timeseriesbody = params.variables;

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.post({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(timeseriesbody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.delete_timeseries = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }
    if (typeof params.aspectName === 'undefined') { reject({answer: null, body: 'aspectName', error: 'Input Error'}) }
    if (typeof params.fromtimestamp === 'undefined') { reject({answer: null, body: 'fromtimestamp', error: 'Input Error'}) }
    if (typeof params.totimestamp === 'undefined') { params.totimestamp = params.fromtimestamp}

    var path = '/api/timeseries/api/timeseries?assetId=' + params.assetId + '&aspectName=' + params.aspectName +
              '&from=' + encodeURIComponent(params.fromtimestamp) + '&to=' + encodeURIComponent(params.totimestamp);

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.delete({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
            },
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

/*
//Export as Module
module.exports = {
  get_token: get_token(),
  get_asset: get_asset(),
  post_asset: post_asset(),
  delete_asset: delete_asset(),
  get_aspect: get_aspect(),
  post_aspect: post_aspect(),
  delete_aspect: delete_aspect(),
  post_timeseries: post_timeseries(),
  delete_timeseries: delete_timeseries()
}
*/
