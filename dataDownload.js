var mindgatev3 = require('./config/mindsphere-https-v3.js');
var moment = require('moment-timezone');

var tsArray = [];
var activePowerArray = [];
var reactivePowerArray = [];
var apparentPowerArray = [];

var minPF = null;
var usage = null;
var peakDemand = null;

var username = 'AdminTechUserEMDS';
var password = '242fec67-45c7-432b-8567-19abf8767cd5';
var baseURL = 'https://emds.piam.eu1.mindsphere.io';

let options = {username: username, password: password, baseURL: baseURL};

exports.getData = function(startTime, endTime) {
	return new Promise(function(resolve, reject) {
			mindgatev3.get_token(options)
	  .then(function(tokenResponse) {
	    //console.log(tokenresponse.error, tokenresponse.answer.statusCode)
	    let tokenResult = JSON.parse(tokenResponse.body);
	    let params = {
	    	bearertoken: tokenResult.access_token,
	    	assetId: '313ba682dd25450da3d249d058f1882a',
	    	aspectName: 'hackathon_PAC4200',
	    	startTime: moment().subtract(100, 'day').startOf('day').toISOString(),
	    	endTime: moment().subtract(100, 'day').toISOString()
	    }
	    return mindgatev3.get_timeseries(params)
	  })
	  .then(function(tsResponse) {
	  	let tsResult = JSON.parse(tsResponse.body);

	  	tsResult.forEach(function(snapshot, index){
	  		tsArray.push(tsResult[index]._time);
	  		activePowerArray.push(tsResult[index].Total_Active_Power);
	  		reactivePowerArray.push(tsResult[index].Total_Reactive_Power);
	  		apparentPowerArray.push(tsResult[index].Total_Apparent_Power);
	  	})

		usage = tsResult[tsResult.length - 1].Active_Energy - tsResult[0].Active_Energy;

	  	peakDemand = Math.max(...activePowerArray);

	  	results = {
	  		tsArray: tsArray,
	  		activePowerArray: activePowerArray,
	  		reactivePowerArray: reactivePowerArray,
	  		apparentPowerArray: apparentPowerArray,
	  		usage: usage,
	  		peakDemand: peakDemand
	  	}
	  	//console.log(results)
	  	resolve(results)
	  })
	  .catch(function(response) {
	    reject(response)
	  })
	})
}