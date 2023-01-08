const expressRateLimit = require("express-rate-limit");

module.exports = expressRateLimit({
	max: 1,
	windowMs: 1000,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		res.redirect(req.originalUrl);
	}
});