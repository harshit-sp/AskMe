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
