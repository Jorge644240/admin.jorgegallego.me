const { Router } = require("express");
const router = Router();

router.use((req, res, next) => {
	res.setHeader("Strict-Transport-Security", process.env.STRICT_TRANSPORT_SECURITY);
	res.setHeader("X-Content-Type-Options", process.env.X_CONTENT_TYPE_OPTIONS);
	res.setHeader("X-XSS-Protection", process.env.X_XSS_PROTECTION);
	res.setHeader("X-Frame-Options", process.env.X_FRAME_OPTIONS);
	res.setHeader("Content-Security-Policy", process.env.CONTENT_SECURITY_POLICY);
	res.removeHeader("X-Powered-By");
	next();
});

module.exports = router;