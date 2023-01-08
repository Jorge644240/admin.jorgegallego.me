const { Router } = require("express");
const verifyAdmin = require("../middleware/login/verifyAdmin");
const postRequestRateLimiter = require("../middleware/rateLimit/postRequestRateLimiter");
const router = Router();

router.use(verifyAdmin);

router.post("*", postRequestRateLimiter);

router.get("/", (req, res) => {
	res.render("dashboard", {
		title: "Admin Dashboard | Jorge Gallego"
	});
});

module.exports = router;