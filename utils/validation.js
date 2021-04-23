
function testRegex(reg, str) {
    if (!reg || !str) return false;
    return reg.test(str);
}


exports.validateUserName = (userName="_") => {
    return testRegex(/^(?=.{6,30}$)(?!\.)(?!.*?\.\.)(?!.*\.$)[a-zA-Z0-9_.]+(?!\.)$/i, userName);
}

exports.validateEmail = (email) =>  {
    // return testRegex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, email);
    return testRegex(/^(([a-zA-Z0-9_.]+(?![<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"])+)*)|(".+"))@([a-zA-Z0-9_.]+(?![<>()[\].,;:\s@"]+\.)+[a-zA-Z0-9_.]+(?![<>()[\].,;:\s@"]{2,}))$/i, email);
}

exports.validatePassword = (password) =>  {
    // return testRegex(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, email);
    return testRegex(/^(?=.{6,30}$)(?![\s.])[a-zA-Z0-9_.!@#$%^&*()[\]{}<>?,]+$/i, password);
}

exports.validateUrl = (url) => {
    let regex = /^\/[^\s]+$/g;
    return regex.test(url);
}