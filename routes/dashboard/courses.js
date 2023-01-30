const { Router } = require("express");
const { getAllCourses, createCourse, verifyCourse, deleteCourse } = require("../../controllers/course.controller");
const authenticateAdminForPostRequests = require("../../middleware/dashboard/authenticateAdminForPostRequests");
const router = Router();

router.get("/", async (req, res) => {
	const { message, error } = req.cookies;
	res.clearCookie("message");
	res.clearCookie("error");
	res.render("dashboard", {
		title: "Courses | Admin Dashboard | Jorge Gallego",
		adminDashboardSection: "courses",
		courses: await getAllCourses(),
		message: message || null,
		error: error || null
	});
});

router.get("/create", (req, res) => {
	res.render("dashboard/create", {
		title: "Create Course | Courses | Admin Dashboard | Jorge Gallego",
		resourceType: "course"
	});
});

router.post("/create", (req, res) => {
	const action = req.body.action;
	if (action === "Create Course") {
		const { name, school, url, year, topic } = req.body;
		createCourse({ name, school, url, year, topic })
		.then(result => {
			res.cookie("message", result);
		})
		.catch(error => {
			res.cookie("error", error.message);
		})
		.finally(() => {
			res.redirect("/dashboard/courses");
		});
	} else res.redirect("/logout");
});

router.get("/remove", (req, res) => {
	if (!req.query.id) res.redirect("/dashboard");
	else {
		verifyCourse(req.query.id)
		.then(result => {
			if (!result) res.redirect("/dashboard/courses");
			else if (result) res.render("dashboard/remove", {
				title: "Remove Course | Courses | Admin Dashboard | Jorge Gallego"
			});
		})
	}
});

router.post("/remove", authenticateAdminForPostRequests, (req, res) => {
	if (!req.query.id) res.redirect("/logout");
	else {
		deleteCourse(req.query.id)
		.then(result => {
			res.cookie("message", result);
		})
		.catch(error => {
			res.cookie("error", error.message);
		})
		.finally(() => {
			res.redirect("/dashboard/courses");
		});
	}
});

module.exports = router;