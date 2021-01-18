function commentToogle(num) {
	console.log(num);
	console.log("comment-section" + num);
	var x = document.getElementById(num);
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

$(".toast").toast("show");

function toggle(x) {
	x.classList.toggle("fas");
}

var clicked = true;
$(document).ready(function () {
	$("#like").click(function () {
		console.log();
		if (clicked) {
			$("#ilike").addClass("fas");
			$("#ilike").removeClass("far");
			clicked = false;
		} else {
			$("#ilike").addClass("far");
			$("#ilike").removeClass("fas");
			clicked = true;
		}
	});
});
