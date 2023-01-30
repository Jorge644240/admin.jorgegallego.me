const { Router } = require("express");
const { getAllJobs, createJob, verifyJob, deleteJob, getJobById, updateJob } = require("../../controllers/job.controller");
const { marked } = require("marked");
const authenticateAdminForPostRequests = require("../../middleware/dashboard/authenticateAdminForPostRequests");
const router = Router();

router.get("/", async (req, res) => {
	const { message, error } = req.cookies;
	res.clearCookie("message");
	res.clearCookie("error");
	res.render("dashboard", {
		title: "Work Experience | Admin Dashboard | Jorge Gallego",
		adminDashboardSection: "experience",
		experiences: await getAllJobs(),
		message: message || null,
		error: error || null
	});
});

router.get("/create", (req, res) => {
	res.render("dashboard/create", {
		title: "Create Experience | Work Experience | Admin Dashboard | Jorge Gallego",
		resourceType: "experience"
	});
});

router.post("/create", (req, res) => {
	const action = req.body.action;
	if (action === "Create Experience") {
		const { title, company, website, summary, type, description, startDate, endDate } = req.body;
		createJob({
			title,
			company,
			website,
			summary,
			type,
			description,
			startDate,
			endDate: endDate || null
		})
		.then(result => {
			res.cookie("message", result);
		})
		.catch(error => {
			res.cookie("error", error.message);
		})
		.finally(() => {
			res.redirect("/dashboard/experience");
		});
	} else res.redirect("/logout");
});

router.get("/edit", (req, res) => {
	if (!req.query.itemId) {
		getAllJobs()
		.then(jobs => {
			res.render("dashboard/edit", {
				title: "Edit Experience | Work Experience | Admin Dashboard | Jorge Gallego",
				selectItemOptions: jobs
			});
		})
		.catch(err => {
			res.cookie("error", err.message);
			res.redirect("/dashboard/skills");
		});
	} else if (req.query.itemId) {
		getJobById(req.query.itemId)
		.then(job => {
			if(job === null) res.redirect("/dashboard/experience");
			else if (job) res.render("dashboard/edit", {
				title: "Edit Experience | Work Experience | Admin Dashboard | Jorge Gallego",
				resourceType: "experience",
				job
			});
		})
		.catch(err => {
			res.cookie("error", err.message);
			res.redirect("/dashboard/experience");
		});
	}
});

router.post("/edit", (req, res) => {
	const action = req.body.action;
	if (action === "Edit Experience") {
		if (!req.query.itemId) res.redirect("/logout");
		else {
			const { title, website, summary, description, endDate } = req.body;
			const updateOptions = {};
			if (title !== "") updateOptions.title = title;
			if (website !== "") updateOptions.website = website;
			if (summary !== "") updateOptions.summary = summary;
			if (description !== "") updateOptions.description = description;
			if (endDate !== "") updateOptions.endDate = endDate;
			updateJob(req.query.itemId, updateOptions)
			.then(result => {
				res.cookie("message", result);
			})
			.catch(error => {
				res.cookie("error", error.message);
			})
			.finally(() => {
				res.redirect("/dashboard/experience");
			});
		}
	} else res.redirect("/logout");
});

router.get("/remove", (req, res) => {
	if (!req.query.id) res.redirect("/dashboard");
	else {
		verifyJob(req.query.id)
		.then(result => {
			if (!result) res.redirect("/dashboard/experience");
			else if (result) res.render("dashboard/remove", {
				title: "Remove Experience | Work Experience | Admin Dashboard | Jorge Gallego"
			});
		})
	}
});

router.post("/remove", authenticateAdminForPostRequests, (req, res) => {
	if (!req.query.id) res.redirect("/logout");
	else {
		deleteJob(req.query.id)
		.then(result => {
			res.cookie("message", result);
		})
		.catch(error => {
			res.cookie("error", error.message);
		})
		.finally(() => {
			res.redirect("/dashboard/experience");
		});
	}
});

router.get("/view", (req, res) => {
	if (!req.query.id) res.redirect("/dashboard/experience");
	else {
		getJobById(req.query.id)
		.then(experience => {
			if (experience === null) return res.redirect("/dashboard/experience");
			res.render("dashboard/view", {
				title: "View Experience | Work Experience | Admin Dashboard | Jorge Gallego",
				resourceType: "experience",
				experience
			});
		})
		.catch(() => {
			res.redirect("/dashboard/experience")
		});
	}
});

module.exports = router;