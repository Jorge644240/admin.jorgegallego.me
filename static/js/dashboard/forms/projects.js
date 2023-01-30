document.querySelector("label[for='featured']").addEventListener("click", () => {
	document.querySelector("label span").classList.toggle("active");
	if (document.querySelector("label span").textContent === "No") document.querySelector("label span").textContent = "Yes";
	else if (document.querySelector("label span").textContent === "Yes") document.querySelector("label span").textContent = "No";
});