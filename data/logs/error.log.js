const { createLogger, format, transports } = require("winston");
const path = require("node:path");
require("./../../cron/clearErrorLog.job");

const errorLogger = createLogger({
	level: "error",
	transports: [
		new transports.File({
			format: format.combine(
				format.timestamp(),
				format.label({
					label: "admin.jorgegallego.me",
				}),
				format.printf(({ message, label, timestamp }) => {
					return `[Error: ${message} - ${timestamp} - ${label}]`;
				})
			),
			filename: path.join(__dirname, "..", "..", "logs", "error.log"),
			level: "error",
		})
	]
});

if (process.env.NODE_ENV === "development") {
	errorLogger.add(
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.label({
					label: "admin.jorgegallego.me",
				}),
				format.printf(({ message, label, timestamp }) => {
					return `[Error: ${message} - ${timestamp} - ${label}]`;
				})
			),
			level: "error",
		})
	);
}

module.exports = errorLogger;
