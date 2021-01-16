const { isEmpty } = require('lodash');

exports.convertUserParams = (_data = {}, _isResponse=null) => {
	if(isEmpty(_data) || _isResponse === null) return false;

	/*
	*  first_name last_name 
	*  date_of_birth active_code date_created date_modified
	*/

	const data = Object.assign({}, _data),
		fields = { 
			"firstName": "first_name", 
			"lastName": "last_name",
			"dateOfBirth": "date_of_birth",
			"dateCreated": "date_created",
			"dateModified": "date_modified",
			"appsId": "apps_id",
			"dateOfBirth": "date_of_birth"
		};
	
	if(_isResponse) {
		//
		for(let p in fields) {
			if(typeof data[fields[p]] !== "undefined") {
				data[p] = data[fields[p]];
				delete data[fields[p]];
			}
		}
	} else {
		// request
		for(let p in fields) {
			if(typeof data[p] !== "undefined") {
				data[fields[p]] = data[p]
				delete data[p];
			}
		}
	}

	return data;
}

const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`); 

exports.convertParamsToSnakeStyle = (_data) => {
	if(isEmpty(_data)) return false;

	let _return = {};
	for(let p in _data) {
		let snakeCase = camelToSnakeCase(p);
		_return[snakeCase] = _data[p];
	}

	console.log(_return)
	return _return;
}

const snakeToCamel = (_str) => _str.slice(0).replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
		.replace('-', '')
		.replace('_', '')
);

exports.convertParamsToCamelStyle = (_data) => {
	if(isEmpty(_data)) return false;
	const obj = _data;

	let _return = {};
	for(let p in obj) {
		if(p && p[0] === '_') {
			_return[p] = obj[p];
		} else {
			let camel = snakeToCamel(p);
			_return[camel] = obj[p];
		}
	}

	return _return;
}