document.querySelector("aside.actions a.create").addEventListener("click", () => {
	window.location.href = "/dashboard/skills/create";
});

document.querySelector("aside.actions a.edit").addEventListener("click", () => {
	window.location.href = "/dashboard/skills/edit";
});

document.querySelectorAll(".tooltip a.edit").forEach(editSkillLink => {
	editSkillLink.addEventListener("click", () => {
		window.location.href = `/dashboard/skills/edit?itemId=${editSkillLink.dataset.skill}`;
	});
});

document.querySelectorAll(".tooltip a.remove").forEach(removeSkillLink => {
	removeSkillLink.addEventListener("click", () => {
		window.location.href = `/dashboard/skills/remove?id=${removeSkillLink.dataset.skill}`;
	});
});