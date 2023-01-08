require("dotenv").config();

test("Logs are handled with file in 'logs/' folder", () => {
	const errorLogger = require("../../../data/logs/info.log");
	expect(errorLogger.transports[0]).toHaveProperty("name", "file");
	expect(errorLogger.transports[0]).toHaveProperty("filename");
	expect(errorLogger.transports[0]).toHaveProperty("dirname");
});