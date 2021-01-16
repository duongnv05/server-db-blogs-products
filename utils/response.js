const { statusResponse } = require('../constants/Global')

module.exports = ({res, data = {}}) => {
	if(!res) {
		console.error("res is undefined!")
	}

	let _data = {};
	Object.assign(_data, data);
	
	if(_data.error) {
		_data.status = statusResponse.ERROR;
	} else {
		_data.status = statusResponse.SUCCESS;
	}

	res.status(200).json(_data);
}