const { isArray } = require('lodash');

const ERR_SYSTEM = 'Error system';

const ERR_INPUT_DATA = 'Error data input';
const ERROR_INPUT_USER_INCORRECT = "Error user is incorrect";
const ERROR_USERNAME_INCORRECT = "Error username is incorrect";
const ERROR_FIRST_NAME_INCORRECT = "Error first name is incorrect";
const ERROR_LAST_NAME_INCORRECT = "Error last name is incorrect";
const ERROR_EMAIL_INCORRECT = "Error email is incorrect";
const ERROR_PASSWORD_INCORRECT = "Error Password is incorrect";
const ERROR_PHONE_INCORRECT = "Error phone is incorrect";
const ERROR_ADDRESS_INCORRECT = "Error address is incorrect";

const ERR_USERNAME_ALREADY_TAKEN = 'Username already taken';
const ERR_EMAIL_ALREADY_TAKEN = 'Email already taken';

const ERR_USERNAME_OR_PASSWORD_NOT_MATCH = 'Username or password is not match';
const ERR_USERNAME_NOT_EXISTED_OR_NOT_ACTIVE = "Username is not existed or not active";
const ERR_CANNOT_FIND_RESULT = 'Cannot find result';
const ERR_PASSWORD_NOT_MATCH = 'Password is not match';

//- USER
const ERR_USER_NOT_LOGIN = 'Error User not login';

//- APPS
const ERR_ORIGIN_URL_IS_EXISTED = 'Error origin url is taken';
const ERR_APP_NAME_EMPTY = 'Error app name is empty';
const ERR_ORIGIN_URL_IS_EMPTY = 'Error origin url is empty';
const ERR_SHOP_ID_IS_EMPTY = 'Error Shop id is empty';

//- SIGN UP
const ERR_SIGN_UP_FAIL = 'Sign up fail!';

const ERR_UPDATE = 'Update fail';
const ERR_PERMISSION_DENIED = 'Error Permission denied';

const ERR_TITLE_BLOGS_EMPTY = 'Error title blogs is empty';
const ERR_SHORT_DESC_INVALID = "Error short description blogs is invalid";
const ERR_CONTENT_BLOG_INVALID = "Error content blogs is invalid";
const ERR_DATE_RELEASED_INVALID = "Error date released invalid";
const ERR_ACTORS_INVALID = "Error actors is invalid";
const ERR_TAGS_INVALID = "Error tags is invalid";
const ERR_CANNOT_FIND_BLOG_DETAIL = "Cannot find blog detail";
const ERR_BLOG_ID_INVALID = "Blog Id is invalid";

const errorCodes = {
	1: ERR_SYSTEM,
	2: ERR_INPUT_DATA,
	3: ERROR_INPUT_USER_INCORRECT,
	4: ERROR_USERNAME_INCORRECT,
	5: ERROR_FIRST_NAME_INCORRECT,
	6: ERROR_LAST_NAME_INCORRECT,
	7: ERROR_EMAIL_INCORRECT,
	8: ERROR_PASSWORD_INCORRECT,
	9: ERROR_PHONE_INCORRECT,
	10: ERROR_ADDRESS_INCORRECT,

	11: ERR_USERNAME_ALREADY_TAKEN,
	12: ERR_EMAIL_ALREADY_TAKEN,

	13: ERR_USERNAME_OR_PASSWORD_NOT_MATCH,
	14: ERR_USERNAME_NOT_EXISTED_OR_NOT_ACTIVE,
	15: ERR_CANNOT_FIND_RESULT,
	16: ERR_PASSWORD_NOT_MATCH,

	17: ERR_UPDATE,

	18: ERR_SIGN_UP_FAIL,

	19: ERR_USER_NOT_LOGIN,
	
	20: ERR_ORIGIN_URL_IS_EXISTED,
	21: ERR_APP_NAME_EMPTY,
	22: ERR_ORIGIN_URL_IS_EMPTY,
	23: ERR_SHOP_ID_IS_EMPTY,
	14: ERR_PERMISSION_DENIED,

	//- BLOGS AND PRODUCT
	1001: ERR_TITLE_BLOGS_EMPTY,
	1002: ERR_SHORT_DESC_INVALID,
	1003: ERR_CONTENT_BLOG_INVALID,
	1004: ERR_DATE_RELEASED_INVALID,
	1005: ERR_ACTORS_INVALID,
	1006: ERR_TAGS_INVALID,
	1007: ERR_CANNOT_FIND_BLOG_DETAIL,
	1008: ERR_BLOG_ID_INVALID
}

module.exports = (_code) => {
	if(isArray(_code)) {
		let error = {}
		for(let i = 0; i < _code.length; i++) {
			let c = _code[i];

			let tempMessage = errorCodes[c] ? errorCodes[c] : "Missing message"
			Object.assign(error, { c: tempMessage });
		}

		return error;
	}

	return {
		error: {
			code: _code,
			message: errorCodes[_code]
		}
	}
}