const { createLogger, format, transports } = require("winston");
const path = require("node:path");
require("./../../cron/clearInfoLog.job");

const infoLogger = createLogger({
	level: "info",
	transports: [
		new transports.File({
			format: format.combine(
				format.timestamp(),
				format.label({
					label: "admin.jorgegallego.me",
				}),
				format.printf(({ message, label, timestamp }) => {
					return `[Info: ${message} - ${timestamp} - ${label}]`;
				})
			),
			filename: path.join(__dirname, "..", "..", "logs", "info.log"),
			level: "info",
		})
	],
});

if (process.env.NODE_ENV === "development") {
	infoLogger.add(
		new transports.Console({
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.label({
					label: "admin.jorgegallego.me",
				}),
				format.printf(({ message, label, timestamp }) => {
					return `[Info: ${message} - ${timestamp} - ${label}]`;
				})
			),
			level: "info",
		})
	);
}

module.exports = infoLogger;
