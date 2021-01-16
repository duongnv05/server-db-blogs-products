const logger = require("node-color-log");

exports.loggerNotify = (_text="") => {
    let text = `[NOTIFY] ${_text}`;

    logger.color("white")
        .dim().italic()
        .log(text);
}

exports.loggerError = (_error="") => {
    let error = `[ERROR] ${_error}`;
    logger.color('white').bgColor('red')
        .log(error);
}

exports.loggerHotError = (_error="") => {
    let error = `[HOT ERROR] ${_error}`;

    logger.color("red").bgColor("blue")
        .bold()
        .log(error);
}

exports.logger = (_log="") => {
    let log = `[LOGGER] ${log}`;

    logger.color('blue').bgColor('white')
        .italic()
        .log(_log)
}

exports.loggerData = (_data="") => {
    let logData = `[DATA] ${_data}`

    logger.color('green').bgColor('black')
        .italic()
        .log(logData);
}

exports.loggerDebug = (_debug="") => {
    let debug = `[DEBUG] ${_debug}`;

    logger.color("cyan").bgColor("white")
        .log(debug);
}

exports.loggerWarning = (_warning="") => {
    let warning = `[WARNING] ${_warning}`;

    logger.color('yellow').bgColor("black")
        .log(warning);
}