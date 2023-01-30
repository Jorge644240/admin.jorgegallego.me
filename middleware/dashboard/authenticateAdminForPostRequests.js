const { verify } = require("jsonwebtoken");
const hash = require("hash.js");
const { authenticateAdmin } = require("../../controllers/admin.controller");

module.exports = async (req, res, next) => {
	if (req.body.action !== "Confirm Action") res.redirect("/logout");
	const isAdminValid = await authenticateAdmin({
		username: verify(req.signedCookies.adminToken, process.env.JWT_SIGNATURE).username,
		password: hash.sha512().update(req.body.pass.concat(process.env.ADMIN_PASS_SALT)).digest("hex")
	});
	if (!isAdminValid) res.redirect("/logout");
	else if (isAdminValid) next();
};