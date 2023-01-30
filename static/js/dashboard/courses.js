document.querySelector("aside.actions a.create").addEventListener("click", () => {
	window.location.href = "/dashboard/courses/create";
});

document.querySelectorAll(".tooltip a.remove").forEach(removeCourseLink => {
	removeCourseLink.addEventListener("click", () => {
		window.location.href = `/dashboard/courses/remove?id=${removeCourseLink.dataset.course}`;
	});
});