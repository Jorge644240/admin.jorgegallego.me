const { Router } = require("express");
const { verify } = require("jsonwebtoken");
const { verifyAdmin } = require("../controllers/admin.controller");
const router = Router();

router.get("/", async (req, res, next) => {
	console.log(req.signedCookies.adminToken);
	if (!req.signedCookies.adminToken) res.redirect("/login");
	else if (req.signedCookies.adminToken) {
		try {
			const adminToken = verify(req.signedCookies.adminToken, process.env.JWT_SIGNATURE);
			const adminExists = await verifyAdmin(adminToken.username);
			if (adminExists === true) res.redirect("/dashboard");
			else if (adminExists === false) throw new Error();
		} catch (err) {
			res.clearCookie("adminToken");
			res.redirect("/login");
		};
	}
});

module.exports = router;