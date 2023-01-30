document.querySelector("aside.actions a.create").addEventListener("click", () => {
	window.location.href = "/dashboard/experience/create";
});

document.querySelector("aside.actions a.edit").addEventListener("click", () => {
	window.location.href = "/dashboard/experience/edit";
});

document.querySelectorAll(".tooltip a.view").forEach(editExperienceLink => {
	editExperienceLink.addEventListener("click", () => {
		window.location.href = `/dashboard/experience/view?id=${editExperienceLink.dataset.experience}`;
	});
});

document.querySelectorAll(".tooltip a.edit").forEach(editExperienceLink => {
	editExperienceLink.addEventListener("click", () => {
		window.location.href = `/dashboard/experience/edit?itemId=${editExperienceLink.dataset.experience}`;
	});
});

document.querySelectorAll(".tooltip a.remove").forEach(removeExperienceLink => {
	removeExperienceLink.addEventListener("click", () => {
		window.location.href = `/dashboard/experience/remove?id=${removeExperienceLink.dataset.experience}`;
	});
});