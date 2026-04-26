const winston = require("winston");
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

const isprod = process.env.NODE_ENV === "production";

const transports = [
    new winston.transports.Console()
];

const { combine, timestamp, json, prettyPrint, errors} = winston.format;


if (isprod) {
    const token = process.env.BETTER_STACK_TOKEN;
    const logtail = new Logtail(token);
    transports.push(new LogtailTransport(logtail));
} else {
    transports.push(new winston.transports.File({ filename: "logs/dev.log" }));
}

const logger = winston.createLogger({
    level: isprod ? "info" : "debug",
    format: isprod
        ? combine(errors({ stack : true }), timestamp(), json(), prettyPrint())
        : combine(errors({ stack : true }), timestamp(), json(), prettyPrint()),
    transports
});

module.exports = logger;