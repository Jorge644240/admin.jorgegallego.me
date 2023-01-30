document.querySelector("aside.actions a.create").addEventListener("click", () => {
	window.location.href = "/dashboard/projects/create";
});

document.querySelector("aside.actions a.edit").addEventListener("click", () => {
	window.location.href = "/dashboard/projects/edit";
});

document.querySelectorAll(".tooltip a.view").forEach(editExperienceLink => {
	editExperienceLink.addEventListener("click", () => {
		window.location.href = `/dashboard/projects/view?id=${editExperienceLink.dataset.project}`;
	});
});

document.querySelectorAll(".tooltip a.edit").forEach(editExperienceLink => {
	editExperienceLink.addEventListener("click", () => {
		window.location.href = `/dashboard/projects/edit?itemId=${editExperienceLink.dataset.project}`;
	});
});

document.querySelectorAll(".tooltip a.remove").forEach(removeProjectLink => {
	removeProjectLink.addEventListener("click", () => {
		window.location.href = `/dashboard/projects/remove?id=${removeProjectLink.dataset.project}`;
	});
});