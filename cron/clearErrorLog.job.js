const fs = require("node:fs/promises");
const cron = require("node-cron");
const path = require("node:path");

module.exports = cron.schedule("/1 * * * *", async () => {
	await fs.writeFile(path.join(__dirname, "..", "logs", "error.log"), ""); // Empty contents of Info level log
});