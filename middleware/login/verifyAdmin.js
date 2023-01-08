const { verify } = require("jsonwebtoken");
const { verifyAdmin } = require("../../controllers/admin.controller");

module.exports = (req, res, next) => {
	if (!req.signedCookies.adminToken) res.redirect("/login");
	else if (req.signedCookies.adminToken) {
		try {
			const { username:adminUsername } = verify(req.signedCookies.adminToken, process.env.JWT_SIGNATURE);
			verifyAdmin(adminUsername)
			.then(adminExists => {
				if (adminExists) next();
				else throw new Error("Invalid Admin Username");
			})
			.catch(() => {
				res.clearCookie("adminToken");
				res.redirect("/login");
			});
		} catch (err) {
			res.clearCookie("adminToken");
			res.redirect("/login");
		};
	}
}