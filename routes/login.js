const { Router } = require("express");
const hash = require("hash.js");
const { logInAdmin } = require("../controllers/admin.controller");
const router = Router();

let error = null;

router.get("/", (req, res) => {
	res.render("login", {
		title: "Admin Login | Jorge Gallego",
		error
	});
	error = null;
});

router.post("/", (req, res) => {
	const { username } = req.body;
	const password = hash.sha512().update(req.body.pass.concat(process.env.ADMIN_PASS_SALT)).digest("hex");
	logInAdmin({ username, password })
	.then(result => {
		if (result.message === "Successfully logged in Admin") {
			res.cookie("adminToken", result.token, {
				signed: true,
				secure: true,
				httpOnly: true,
				maxAge: 3600000
			});
			res.redirect("/dashboard");
		} else if (result.error) {
			if (result.message === "Failed to log in Admin") error = "There's been an issue. Please try again.";
			else if (result.message === "Incorrect username and/or password") error = "Incorrect username and/or password";
			res.redirect("/login");
		}
	});
});

module.exports = router;