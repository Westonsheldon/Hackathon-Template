//Version 0.1.0

const httpsRequest = require('request');
//const URL = require('url').Url;

var baseUrl = 'https://gateway.eu1.mindsphere.io';
//var apiURL = new URL('https://mindgate.appsdev.mindsphere.io')

function apiRequestErrorHandling(error, answer, body) { //this handles all output from any api request. This will handle status code errors.
  return new Promise(function(resolve, reject) {
    if (typeof answer.statusCode !== 'undefined') {
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
    } else {
      reject({
        answer: answer,
        body: body,
        error: error
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

    if (typeof params.username === 'undefined') { reject({answer: null, body: 'username', error: 'Input Error'}) }
    if (typeof params.password === 'undefined') { reject({answer: null, body: 'password', error: 'Input Error'}) }

    /*--------------------------------------------------------------------------------------
    This portion of the function strucutres and encodes the applicationid and clientSecret
    ----------------------------------------------------------------------------------------*/

    var stringToEncode = params.username + ':' + params.password;
    var base64 = new Buffer(stringToEncode).toString('base64');

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: 'https://emds.piam.eu1.mindsphere.io/oauth/token?grant_type=client_credentials',
            headers: {
              'Authorization': 'Basic ' + base64,
              'Content-Type': 'application/x-www-form-urlencoded'
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

    var path = '/api/assetmanagement/v3/assets';

    if (typeof params.assetId !== 'undefined') { path += '/' + params.assetId; }
    if (typeof params.pageSize != 'undefined') { path += '?size=' + params.pageSize}
    if (typeof params.page !== 'undefined') { path += '?page=' + params.page + '&size=' + params.pageSize};

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json',
              'Accept': 'application/hal+json'
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
    if (typeof params.name === 'undefined') { reject({answer: null, body: 'name', error: 'Input Error'}) }
    if (typeof params.typeId === 'undefined') { reject({answer: null, body: 'typeId', error: 'Input Error'}) }
    if (typeof params.parentId === 'undefined') { reject({answer: null, body: 'parentId', error: 'Input Error'}) }
    if (typeof params.description === 'undefined') { params.description = ''}
    if (typeof params.country === 'undefined') { params.country = ''}
    if (typeof params.region === 'undefined') { params.region = ''}
    if (typeof params.t2Tenant === 'undefined') { params.t2Tenant = ''}
    if (typeof params.externalId === 'undefined') { params.externalId = ''}
    if (typeof params.longitude === 'undefined') { params.longitude = ''}
    if (typeof params.latitude === 'undefined') { params.latitude = ''}
    if (typeof params.streetAddress === 'undefined') { params.streetAddress = ''}
    if (typeof params.locality === 'undefined') { params.locality = ''}
    if (typeof params.postalcode === 'undefined') { params.postalcode = ''}

    var path = '/api/assetmanagement/v3/assets';

    /*--------------------------------------------------------------------------------------
    This portion of the function creates an asset object with require properties.
    JSON Structure of Object:
    {
      "name": "string",
      "typeId": "string",
      "parentId": "string",
      "description": "string",
      "externalId": "string",
      "t2Tenant": "string",
      "location": {
        "country": "string",
        "region": "string",   - i.e. state
        "locality": "string", - i.e. city
        "streetAddress": "string",
        "postalCode": "string",
        "longitude": float/double,
        "latitude": float/double
      }
    }
    ----------------------------------------------------------------------------------------*/
    var assetlocation = {
      country: params.country,
      region: params.region,
      locality: params.locality,
      streetAddress: params.streetAddress,
      postalCode: params.postalCode,
      longitude: params.longitude,
      latitude: params.latitude
    }

    var assetbody = {
      name: params.name,
      typeId: params.typeId,
      parentId: params.parentId,
      description: params.description,
      externalId: params.externalId,
      t2Tenant: params.t2Tenant,
      location: JSON.parse(JSON.stringify(assetlocation))
    }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.post({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json',
              'Accept': 'application/hal+json'
            },
            body: JSON.stringify(assetbody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.get_children = function(params) {

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.parentId !== 'undefined') { path += '/' + params.assetId; }

    var path = '/api/assetmanagement/v3/assets?filter={"parentId":"' + params.parentId + '"}';

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json',
              'Accept': 'application/hal+json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.get_assettype = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }

    var path = '/api/assetmanagement/v3/assettypes';

    if (typeof params.assetTypeId !== 'undefined') { path += '/' + params.assetTypeId; }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json',
              'Accept': 'application/hal+json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.put_assettype = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.update !== 'boolean') { reject({answer: null, body: 'update', error: 'Input Error'}) }
    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetTypeId === 'undefined') { reject({answer: null, body: 'assetTypeId', error: 'Input Error'}) }
    if (typeof params.name === 'undefined') { reject({answer: null, body: 'name', error: 'Input Error'}) }
    if (typeof params.description === 'undefined') { reject({answer: null, body: 'description', error: 'Input Error'}) }
    if (typeof params.parentTypeId === 'undefined') { params.parentTypeId = 'core.basicagent'}
    if (typeof params.instantiable === 'undefined') { params.instantiable = true}
    if (typeof params.scope === 'undefined') { params.scope = "private"}
    if(!Array.isArray(params.aspects)){params.aspects = [params.aspects]}
    params.aspects.forEach(function(aspect, index){
      if (typeof aspect.name === 'undefined') { reject({answer: null, body: 'aspects['+index+'].name', error: 'Missing Parameter'}) }
      if (typeof aspect.aspectTypeId === 'undefined') { reject({answer: null, body: 'aspects['+index+'].aspectTypeId', error: 'Missing Parameter'}) }
    })

    var path = '/api/assetmanagement/v3/assettypes/' + params.assetTypeId;

    /*--------------------------------------------------------------------------------------
    This portion of the function determines whether the assettype is being created or updated.
    If the assettype is being created, then the additional header "If-Match" is not needed.
    If the assettype is being updated, then the addtional header "If-Match" is required.
    The If-Match header compares the provided value to the assettypes etag.
    The If-Match header must be equal to the etag in order to all the update to occur (i.e. security measure).
    The value of If-Match should be an integer.
    A newly created assettype will start at 0 and is incremented with each update to the assettype.
    ----------------------------------------------------------------------------------------*/
    var header = {
      'Authorization': 'Bearer ' + params.bearertoken,
      'Content-Type': 'application/json',
      'Accept': 'application/hal+json'
    }

    if (update) {
      if (typeof params.ifMatch === 'undefined') { reject({answer: null, body: 'ifMatch', error: 'Input Error'}) }
      header["If-Match"] = params.ifMatch
    }

    /*--------------------------------------------------------------------------------------
    This portion of the function creates an assettype object with require properties.
    JSON Structure of Object:
    {
      "name": "string",
      "description": "string",
      "parentTypeId": "string",
      "instantiable": "string",
      "scope": "string",
      "aspects": [
        {
          "name": "string",
          "aspectTypeId": "string"
        }
      ]
    }
    ----------------------------------------------------------------------------------------*/

    var assettypebody = {
      name: params.name,
      description: params.description,
      parentTypeId: params.parentTypeId,
      instantiable: params.instantiable,
      scope: params.scope,
      aspects: JSON.parse(JSON.stringify(params.aspects))
    }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.put({
            url: baseUrl + path,
            headers: header,
            body: JSON.stringify(assettypebody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.delete_assettype = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetTypeId === 'undefined') { reject({answer: null, body: 'assetTypeId', error: 'Input Error'}) }
    if (typeof params.ifMatch === 'undefined') { reject({answer: null, body: 'ifMatch', error: 'Input Error'}) }

    var path = '/api/assetmanagement/v3/assettypes/' + assetTypeId;

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    The If-Match header compares the provided value to the assettypes etag.
    The If-Match header must be equal to the etag in order to all the update to occur (i.e. security measure).
    The value of If-Match should be an integer.
    A newly created assettype will start at 0 and is incremented with each update to the assettype.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.delete({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json',
              'Accept': 'application/hal+json',
              'If-Match': params.ifMatch
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

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
    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.assetId === 'undefined') { reject({answer: null, body: 'assetId', error: 'Input Error'}) }

    var path = '/api/assetmanagement/v3/assets/' + params.assetId + '/aspects'

    //if (typeof params.aspectName !== 'undefined') { path += '/' + params.aspectName; }

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

exports.get_aspecttype = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }

    var path = '/api/assetmanagement/v3/aspecttypes';

    if (typeof params.aspectTypeId !== 'undefined') { path += '/' + params.aspectTypeId; }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json',
              'Accept': 'application/hal+json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.put_aspecttype = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.update !== 'boolean') { reject({answer: null, body: 'update', error: 'Input Error'}) }
    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.aspectTypeId === 'undefined') { reject({answer: null, body: 'aspectTypeId', error: 'Input Error'}) }
    if (typeof params.name === 'undefined') { reject({answer: null, body: 'name', error: 'Input Error'}) }
    if (typeof params.description === 'undefined') { reject({answer: null, body: 'description', error: 'Input Error'}) }
    if (typeof params.category === 'undefined') { params.category = 'dynamic'}
    if (typeof params.scope === 'undefined') { params.scope = 'private'}
    if(!Array.isArray(params.variables)){params.variables = [params.variables]}
    params.variables.forEach(function(variable, index){
      if (typeof variable.name === 'undefined') { reject({answer: null, body: 'variables['+index+'].name', error: 'Missing Parameter'}) }
      if (typeof variable.dataType === 'undefined') { reject({answer: null, body: 'variables['+index+'].dataType', error: 'Missing Parameter'}) }
      if (typeof variable.unit === 'undefined') { reject({answer: null, body: 'variables['+index+'].unit', error: 'Missing Parameter'}) }
      if (typeof variable.searchable === 'undefined') { variable.searchable = false }
      if (typeof variable.length === 'undefined') { variable.length = null }
      if (typeof variable.qualityCode === 'undefined') { variable.qualityCode = false }
    })

    var path = '/api/assetmanagement/v3/aspecttypes/' + params.aspectTypeId;

    /*--------------------------------------------------------------------------------------
    This portion of the function determines whether the aspecttype is being created or updated.
    If the aspecttype is being created, then the additional header "If-Match" is not needed.
    If the aspecttype is being updated, then the addtional header "If-Match" is required.
    The If-Match header compares the provided value to the aspecttype etag.
    The If-Match header must be equal to the etag in order to all the update to occur (i.e. security measure).
    The value of If-Match should be an integer.
    A newly created assettype will start at 0 and is incremented with each update to the aspecttype.
    ----------------------------------------------------------------------------------------*/
    var header = {
      'Authorization': 'Bearer ' + params.bearertoken,
      'Content-Type': 'application/json',
      'Accept': 'application/hal+json'
    }

    if (update) {
      if (typeof params.ifMatch === 'undefined') { reject({answer: null, body: 'ifMatch', error: 'Input Error'}) }
      header["If-Match"] = params.ifMatch
    }

    /*--------------------------------------------------------------------------------------
    This portion of the function creates an aspecttype object with require properties.
    JSON Structure of Object:
    {
      "name": "string",
      "category": "string",
      "scope": "string",
      "description": "string",
      "variables": [
        {
          "name": "string",
          "dataType": "string",
          "unit": "string",
          "searchable": boolean,
          "length": null (typical) / integer,
          "qualityCode": boolean
        }
      ]
    }
    ----------------------------------------------------------------------------------------*/

    var aspecttypebody = {
      name: params.name,
      description: params.description,
      category: params.category,
      scope: params.scope,
      variables: JSON.parse(JSON.stringify(params.variables))
    }

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.put({
            url: baseUrl + path,
            headers: header,
            body: JSON.stringify(aspecttypebody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.delete_aspecttype = function(params){

  return new Promise(function(resolve, reject){
    /*--------------------------------------------------------------------------------------
    Handle Variables:
    1) Required: Missing value will return an input error.  The body will contain the variable
    name that caused the error.  Answer is set to null, but is still included in order to keep
    the return value consistent (i.e. object with answer, body, error).
    2) Optional: Missing value will be changed to default value.
    ----------------------------------------------------------------------------------------*/

    if (typeof params.bearertoken === 'undefined') { reject({answer: null, body: 'bearertoken', error: 'Input Error'}) }
    if (typeof params.aspectTypeId === 'undefined') { reject({answer: null, body: 'aspectTypeId', error: 'Input Error'}) }
    if (typeof params.ifMatch === 'undefined') { reject({answer: null, body: 'ifMatch', error: 'Input Error'}) }

    var path = '/api/assetmanagement/v3/aspecttypes/' + aspectTypeId;

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    The If-Match header compares the provided value to the assettypes etag.
    The If-Match header must be equal to the etag in order to all the update to occur (i.e. security measure).
    The value of If-Match should be an integer.
    A newly created assettype will start at 0 and is incremented with each update to the assettype.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.delete({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json',
              'Accept': 'application/hal+json',
              'If-Match': params.ifMatch
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.get_timeseries = function(params){

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

    if (typeof params.startTime === 'undefined') { var path = '/api/iottimeseries/v3/timeseries/' + params.assetId + '/' + params.aspectName; };
    if (typeof params.endTime === 'undefined') { var path = '/api/iottimeseries/v3/timeseries/' + params.assetId + '/' + params.aspectName; }
    else {
      var path = '/api/iottimeseries/v3/timeseries/' + params.assetId + '/' + params.aspectName + '?from=' + params.startTime + '&to=' + params.endTime;
    }
    

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.get({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
              // 'Accept': 'application/hal+json'
            }
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}

exports.put_timeseries = function(params){

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
    if(!Array.isArray(params.variables)){params.variables = [params.variables]}
    params.variables.forEach(function(variable, index){
      if (typeof variable._time === 'undefined') { reject({answer: null, body: 'variables['+index+']._time', error: 'Missing Parameter'}) }
      //Due to the formatting of the V3 MindSphere API, we cannot verify the remaining pieces because the names are dynamic
    })

    var path = '/api/iottimeseries/v3/timeseries/' + params.assetId + '/' + params.aspectName;

    /*--------------------------------------------------------------------------------------
    This portion of the function creates a timeseries object with values for N variables.
    JSON Structure of Object:
    [
      {
        "_time": "string",
        "variableName1": <value>,
        "variableName2": <value>,
        ...
        "variableNameN": <value>
      }
    ]
    ----------------------------------------------------------------------------------------*/

    var timeseriesbody = params.variables;

    /*--------------------------------------------------------------------------------------
    This portion of the function makes the actual https request.
    The function will return the MindSphere response.
    ----------------------------------------------------------------------------------------*/

    httpsRequest.put({
            url: baseUrl + path,
            headers: {
              'Authorization': 'Bearer ' + params.bearertoken,
              'Content-Type': 'application/json'
              // 'Accept': 'application/hal+json'
            },
            body: JSON.stringify(timeseriesbody)
        }, function(error, answer, body) {apiRequestErrorHandling(error, answer, body).then(function(answer){resolve(answer)}).catch(function(answer){reject(answer)})}
    );

  //End Promise
  })

//End Function
}
