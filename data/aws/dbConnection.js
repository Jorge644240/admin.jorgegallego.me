const { Sequelize } = require("sequelize");
const errorLogger = require("./../logs/error.log");
const infoLogger = require("./../logs/info.log");
require("dotenv").config();

const connection = new Sequelize({
	dialect: "mysql",
	host: process.env.RDS_DB_HOST,
	username: process.env.RDS_DB_USERNAME,
	password: process.env.RDS_DB_PASSWORD,
	port: 3306,
	database: process.env.RDS_DB_NAME,
	logging: message => {
		if (message instanceof Error) errorLogger.error(message);
		else infoLogger.info(message);
	}
});

(async () => {
	if (process.env.ENV !== "actions") await connection.authenticate();
})();

module.exports = connection;