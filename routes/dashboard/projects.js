const { Router } = require("express");
const { getAllProjects, createProject, verifyProject, deleteProject, getProjectById, updateProject } = require("../../controllers/project.controller");
const authenticateAdminForPostRequests = require("../../middleware/dashboard/authenticateAdminForPostRequests");
const multer = require("multer");
const tinify = require("tinify");
const router = Router();

tinify.key = process.env.TINIFY_API_KEY;

const upload = multer({ 
	storage: multer.memoryStorage()
});

router.get("/", async (req, res) => {
	const { message, error } = req.cookies;
	res.clearCookie("message");
	res.clearCookie("error");
	res.render("dashboard", {
		title: "Projects | Admin Dashboard | Jorge Gallego",
		adminDashboardSection: "projects",
		projects: await getAllProjects(),
		message: message || null,
		error: error || null
	});
});

router.get("/create", (req, res) => {
	res.render("dashboard/create", {
		title: "Create Project | Projects | Admin Dashboard | Jorge Gallego",
		resourceType: "project"
	});
});

router.post("/create", upload.single("image"), async (req, res) => {
	const action = req.body.action;
	if (action === "Create Project") {
		const { name, url, description } = req.body, featured = req.body.featured ? true : false;
		const file = await tinify.fromBuffer(req.file.buffer).toBuffer();
		createProject({
			name, url, description, featured
		}, file)
		.then(result => {
			res.cookie("message", result);
		})
		.catch(err => {
			res.cookie("error", err.message);
		})
		.finally(() => {
			res.redirect("/dashboard/projects");
		});
	} else res.redirect("/logout");
});

router.get("/edit", (req, res) => {
	if (!req.query.itemId) {
		getAllProjects()
		.then(jobs => {
			res.render("dashboard/edit", {
				title: "Edit Project | Projects | Admin Dashboard | Jorge Gallego",
				selectItemOptions: jobs
			});
		})
		.catch(err => {
			res.cookie("error", err.message);
			res.redirect("/dashboard/skills");
		});
	} else if (req.query.itemId) {
		getProjectById(req.query.itemId)
		.then(project => {
			if(project === null) res.redirect("/dashboard/experience");
			else if (project) res.render("dashboard/edit", {
				title: "Edit Experience | Work Experience | Admin Dashboard | Jorge Gallego",
				resourceType: "project",
				project
			});
		})
		.catch(err => {
			res.cookie("error", err.message);
			res.redirect("/dashboard/experience");
		});
	}
});

router.post("/edit", upload.single("image"), async (req, res) => {
	const action = req.body.action;
	if (action === "Edit Project") {
		if (!req.query.itemId) res.redirect("/logout");
		else {
			console.log(req.body, req.file);
			const { url, description } = req.body;
			const updateOptions = {};
			if (url !== "") updateOptions.url = url;
			if (description !== "") updateOptions.description = description;
			const file = req.file ? await tinify.fromBuffer(req.file.buffer).toBuffer() : null;
			updateProject(req.query.itemId, updateOptions, file)
			.then(result => {
				res.cookie("message", result);
			})
			.catch(error => {
				res.cookie("error", error.message);
			})
			.finally(() => {
				res.redirect("/dashboard/projects");
			});
		}
	} else res.redirect("/logout");
});

router.get("/remove", (req, res) => {
	if (!req.query.id) res.redirect("/dashboard");
	else {
		verifyProject(req.query.id)
		.then(result => {
			if (!result) res.redirect("/dashboard/projects");
			else if (result) res.render("dashboard/remove", {
				title: "Remove Project | Projects | Admin Dashboard | Jorge Gallego"
			});
		})
	}
});

router.post("/remove", authenticateAdminForPostRequests, (req, res) => {
	if (!req.query.id) res.redirect("/logout");
	else {
		deleteProject(req.query.id)
		.then(result => {
			res.cookie("message", result);
		})
		.catch(error => {
			res.cookie("error", error.message);
		})
		.finally(() => {
			res.redirect("/dashboard/projects");
		});
	}
});

router.get("/view", (req, res) => {
	if (!req.query.id) res.redirect("/dashboard/projects");
	else {
		getProjectById(req.query.id)
		.then(project => {
			if (project === null) return res.redirect("/dashboard/projects");
			res.render("dashboard/view", {
				title: "View Project | Projects | Admin Dashboard | Jorge Gallego",
				resourceType: "project",
				project
			});
		})
		.catch(() => {
			res.redirect("/dashboard/projects")
		});
	}
});

module.exports = router;