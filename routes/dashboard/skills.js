const { Router } = require("express");
const { getAllSkills, createSkill, verifySkill, deleteSkill, getSkillById, updateSkill } = require("../../controllers/skill.controller");
const authenticateAdminForPostRequests = require("../../middleware/dashboard/authenticateAdminForPostRequests");
const router = Router();

router.get("/", async (req, res) => {
	const { message, error } = req.cookies;
	res.clearCookie("message");
	res.clearCookie("error");
	res.render("dashboard", {
		title: "Skills | Admin Dashboard | Jorge Gallego",
		adminDashboardSection: "skills",
		skills: await getAllSkills(),
		message: message || null,
		error: error || null
	});
});

router.get("/create", (req, res) => {
	res.render("dashboard/create", {
		title: "Create Skill | Skills | Admin Dashboard | Jorge Gallego",
		resourceType: "skill"
	});
});

router.post("/create", (req, res) => {
	const action = req.body.action;
	if (action === "Create Skill") {
		const { name, level } = req.body;
		createSkill({ name, level })
		.then(result => {
			res.cookie("message", result);
		})
		.catch(error => {
			res.cookie("error", error.message);
		})
		.finally(() => {
			res.redirect("/dashboard/skills");
		});
	} else res.redirect("/logout");
});

router.get("/edit", (req, res) => {
	if (!req.query.itemId) {
		getAllSkills()
		.then(skills => {
			res.render("dashboard/edit", {
				title: "Edit Skill | Skills | Admin Dashboard | Jorge Gallego",
				selectItemOptions: skills
			});
		})
		.catch(err => {
			res.cookie("error", err.message);
			res.redirect("/dashboard/skills");
		});
	} else if (req.query.itemId) {
		getSkillById(req.query.itemId)
		.then(skill => {
			if(skill === null) res.redirect("/dashboard/skills");
			else if (skill) res.render("dashboard/edit", {
				title: "Edit Skill | Skills | Admin Dashboard | Jorge Gallego",
				resourceType: "skill",
				skill
			});
		})
		.catch(err => {
			res.cookie("error", err.message);
			res.redirect("/dashboard/skills");
		});
	}
});

router.post("/edit", (req, res) => {
	const action = req.body.action;
	if (action === "Edit Skill") {
		if (!req.query.itemId) res.redirect("/logout");
		else {
			updateSkill(req.query.itemId, { level:req.body.level })
			.then(result => {
				res.cookie("message", result);
			})
			.catch(error => {
				res.cookie("error", error.message);
			})
			.finally(() => {
				res.redirect("/dashboard/skills");
			});
		}
	} else res.redirect("/logout");
});

router.get("/remove", (req, res) => {
	if (!req.query.id) res.redirect("/dashboard");
	else {
		verifySkill(req.query.id)
		.then(result => {
			if (!result) res.redirect("/dashboard/skills");
			else if (result) res.render("dashboard/remove", {
				title: "Remove Skill | Skills | Admin Dashboard | Jorge Gallego"
			});
		})
	}
});

router.post("/remove", authenticateAdminForPostRequests, (req, res) => {
	if (!req.query.id) res.redirect("/logout");
	else {
		deleteSkill(req.query.id)
		.then(result => {
			res.cookie("message", result);
		})
		.catch(error => {
			res.cookie("error", error.message);
		})
		.finally(() => {
			res.redirect("/dashboard/skills");
		});
	}
});

module.exports = router;