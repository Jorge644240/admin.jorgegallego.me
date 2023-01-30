const { Router } = require("express");
const { getAllContacts } = require("../../controllers/contact.controller");
const router = Router();

router.get("/", async (req, res) => {
	res.render("dashboard", {
		title: "Contacts | Admin Dashboard | Jorge Gallego",
		adminDashboardSection: "contacts",
		contacts: await getAllContacts()
	});
});

module.exports = router;