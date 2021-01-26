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

function togglereport(num) {
	console.log(num);
	console.log("report-section" + num);
	var x = document.getElementById(num);
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

$(document).ready(function () {
	$("body").tooltip({ selector: "[data-toggle=tooltip]" });
});

$(".toast").toast("show");

function toggle(x) {
	x.classList.toggle("fas");
}

function ansLikeDislike(ansId, type, val) {
	const url = "/question/answer/" + type + "/" + ansId + "/" + val;
	$.ajax({
		method: "GET",
		url: url,
		dataType: "json",
		data: { ansId: ansId, type: type, val: val },
	}).done((data) => {
		$("#" + type + "-" + ansId).text(data.result);
		// location.reload();
	});
}

var lval = -1;
var llval = 1;
function f(ansId, type) {
	if (type == "like") {
		if (lval == -1) {
			$("#ilike-" + ansId).addClass("far");
			$("#ilike-" + ansId).removeClass("fas");
		} else {
			$("#ilike-" + ansId).addClass("fas");
			$("#ilike-" + ansId).removeClass("far");
		}
		ansLikeDislike(ansId, "like", lval);
		lval = -lval;
	} else if (type == "l") {
		if (llval == -1) {
			$("#ilike-" + ansId).addClass("far");
			$("#ilike-" + ansId).removeClass("fas");
		} else {
			$("#ilike-" + ansId).addClass("fas");
			$("#ilike-" + ansId).removeClass("far");
		}
		ansLikeDislike(ansId, "like", llval);
		llval = -llval;
	}
}

var dval = -1;
var ddval = 1;
function fd(ansId, type) {
	if (type == "dislike") {
		if (dval == -1) {
			$("#idislike-" + ansId).addClass("far");
			$("#idislike-" + ansId).removeClass("fas");
		} else {
			$("#idislike-" + ansId).addClass("fas");
			$("#idislike-" + ansId).removeClass("far");
		}
		ansLikeDislike(ansId, "dislike", dval);
		dval = -dval;
	} else if (type == "d") {
		if (ddval == -1) {
			$("#idislike-" + ansId).addClass("far");
			$("#idislike-" + ansId).removeClass("fas");
		} else {
			$("#idislike-" + ansId).addClass("fas");
			$("#idislike-" + ansId).removeClass("far");
		}
		ansLikeDislike(ansId, "dislike", ddval);
		ddval = -ddval;
	}
}
