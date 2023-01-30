const UAParser = require("ua-parser-js");

module.exports = (req, res, next) => {
	if (UAParser(req.headers["user-agent"]).device.type) return res.render("error");
	next();
};