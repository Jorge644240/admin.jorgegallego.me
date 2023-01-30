const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
	res.clearCookie("adminToken");
	res.redirect("/login");
});

module.exports = router;