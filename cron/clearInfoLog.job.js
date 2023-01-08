const fs = require("node:fs/promises");
const cron = require("node-cron");
const path = require("node:path");

module.exports = cron.schedule("0 8 * * *", async () => {
	await fs.writeFile(path.join(__dirname, "..", "logs", "info.log"), ""); // Empty contents of Info level log
});