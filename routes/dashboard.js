const { Router } = require("express");
const { verify } = require("jsonwebtoken");
const verifyAdmin = require("../middleware/login/verifyAdmin");
const postRequestRateLimiter = require("../middleware/rateLimit/postRequestRateLimiter");
const { getTopSkills } = require("../controllers/skill.controller");
const { getLatestJobs } = require("../controllers/job.controller");
const { getFeaturedProjects } = require("../controllers/project.controller");
const { getLatestCourses } = require("../controllers/course.controller");
const { getLatestContacts } = require("../controllers/contact.controller");
const skills = require("./dashboard/skills");
const experience = require("./dashboard/experience");
const projects = require("./dashboard/projects");
const courses = require("./dashboard/courses");
const contacts = require("./dashboard/contacts");
const router = Router();

router.use(verifyAdmin);

router.post("*", postRequestRateLimiter);

router.get("/", async (req, res) => {
	res.render("dashboard", {
		title: "Admin Dashboard | Jorge Gallego",
		adminDashboardSection: "home",
		admin: verify(req.signedCookies.adminToken, process.env.JWT_SIGNATURE),
		skills: await getTopSkills(),
		experiences: await getLatestJobs(),
		projects: await getFeaturedProjects(),
		courses: await getLatestCourses(),
		contacts: await getLatestContacts()
	});
});

router.get("/profile", async (req, res) => {
	res.render("dashboard", {
		title: "Admin Profile | Admin Dashboard | Jorge Gallego",
		adminDashboardSection: "profile",
		admin: verify(req.signedCookies.adminToken, process.env.JWT_SIGNATURE)
	});
});

router.use("/skills", skills);

router.use("/experience", experience);

router.use("/projects", projects);

router.use("/courses", courses);

router.use("/contacts", contacts);

module.exports = router;