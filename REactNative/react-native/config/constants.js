const CONSTANTS = {};

CONSTANTS.baseURL="http://192.168.43.86:4000";
CONSTANTS.distanceRadius=5;


for(key in CONSTANTS)
	if(CONSTANTS.hasOwnProperty(key))
		module.exports[key] = CONSTANTS[key];