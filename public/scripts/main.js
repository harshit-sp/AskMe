// To toggle comment section
function commentToogle(num) {
	// console.log(num);
	var x = document.getElementById("comment-section-" + num);
	if (x.style.display === "none") {
		x.style.display = "block";
		$("#comment-" + num).addClass("fas");
		$("#comment-" + num).removeClass("far");
	} else {
		x.style.display = "none";
		$("#comment-" + num).addClass("far");
		$("#comment-" + num).removeClass("fas");
	}
}

// To toggle report section
function togglereport(num) {
	// console.log(num);
	// console.log("report-section" + num);
	var x = document.getElementById(num);
	if (x.style.display === "none") {
		x.style.display = "block";
	} else {
		x.style.display = "none";
	}
}

// For tooltip
$(document).ready(function () {
	$("body").tooltip({ selector: "[data-toggle=tooltip]" });
});

// For toast
$(".toast").toast("show");

function toggle(x) {
	x.classList.toggle("fas");
}

// For likes and dislikes
function ansLikeDislike(ansId, type, val) {
	const url = "/question/answer/" + type + "/" + ansId + "/" + val;
	$.ajax({
		method: "GET",
		url: url,
		dataType: "json",
		data: { ansId: ansId, type: type, val: val },
	}).done((data) => {
		$("#" + type + "-" + ansId).text(data.result[0]);
		console.log(data.change);
		if (data.change) {
			// location.reload();
			// console.log(data.result);
			if (type == "like") {
				$("#ilike-" + ansId).addClass("fas");
				$("#ilike-" + ansId).removeClass("far");
				$("#idislike-" + ansId).addClass("far");
				$("#idislike-" + ansId).removeClass("fas");
				$("#dislike-" + ansId).text(data.result[1]);
				dval["" + ansId] = -dval["" + ansId];
			} else {
				$("#ilike-" + ansId).addClass("far");
				$("#ilike-" + ansId).removeClass("fas");
				$("#idislike-" + ansId).addClass("fas");
				$("#idislike-" + ansId).removeClass("far");
				$("#like-" + ansId).text(data.result[1]);
				lval["" + ansId] = -lval["" + ansId];
			}
		}
	});
}

// var lval = -1;
// var llval = 1;
// function f(ansId, type) {
// 	if (type == "like") {
// 		if (lval == -1) {
// 			$("#ilike-" + ansId).addClass("far");
// 			$("#ilike-" + ansId).removeClass("fas");
// 		} else {
// 			$("#ilike-" + ansId).addClass("fas");
// 			$("#ilike-" + ansId).removeClass("far");
// 		}
// 		ansLikeDislike(ansId, "like", lval);
// 		lval = -lval;
// 	} else if (type == "l") {
// 		if (llval == -1) {
// 			$("#ilike-" + ansId).addClass("far");
// 			$("#ilike-" + ansId).removeClass("fas");
// 		} else {
// 			$("#ilike-" + ansId).addClass("fas");
// 			$("#ilike-" + ansId).removeClass("far");
// 		}
// 		ansLikeDislike(ansId, "like", llval);
// 		llval = -llval;
// 	}
// }

// var dval = -1;
// var ddval = 1;
// function fd(ansId, type) {
// 	if (type == "dislike") {
// 		if (dval == -1) {
// 			$("#idislike-" + ansId).addClass("far");
// 			$("#idislike-" + ansId).removeClass("fas");
// 		} else {
// 			$("#idislike-" + ansId).addClass("fas");
// 			$("#idislike-" + ansId).removeClass("far");
// 		}
// 		ansLikeDislike(ansId, "dislike", dval);
// 		dval = -dval;
// 	} else if (type == "d") {
// 		if (ddval == -1) {
// 			$("#idislike-" + ansId).addClass("far");
// 			$("#idislike-" + ansId).removeClass("fas");
// 		} else {
// 			$("#idislike-" + ansId).addClass("fas");
// 			$("#idislike-" + ansId).removeClass("far");
// 		}
// 		ansLikeDislike(ansId, "dislike", ddval);
// 		ddval = -ddval;
// 	}
// }

const lval = {};
function f(ansId, type) {
	if (type == "like") {
		ansIdStr = "" + ansId;
		if (lval[ansIdStr] != null) {
		} else {
			lval[ansIdStr] = -1;
		}
		if (lval[ansIdStr] == -1) {
			$("#ilike-" + ansId).addClass("far");
			$("#ilike-" + ansId).removeClass("fas");
		} else {
			$("#ilike-" + ansId).addClass("fas");
			$("#ilike-" + ansId).removeClass("far");
		}
	} else if (type == "l") {
		ansIdStr = "" + ansId;
		if (lval[ansIdStr] != null) {
		} else {
			lval[ansIdStr] = 1;
		}
		if (lval[ansIdStr] == -1) {
			$("#ilike-" + ansId).addClass("far");
			$("#ilike-" + ansId).removeClass("fas");
		} else {
			$("#ilike-" + ansId).addClass("fas");
			$("#ilike-" + ansId).removeClass("far");
		}
	}
	ansLikeDislike(ansId, "like", lval[ansIdStr]);
	lval[ansIdStr] = -lval[ansIdStr];
	// console.log(lval);
}

// var dval = -1;
// var dval = 1;
const dval = {};
function fd(ansId, type) {
	ansIdStr = "" + ansId;

	if (type == "dislike") {
		if (dval[ansIdStr] != null) {
		} else {
			dval[ansIdStr] = -1;
		}
		if (dval[ansIdStr] == -1) {
			$("#idislike-" + ansId).addClass("far");
			$("#idislike-" + ansId).removeClass("fas");
		} else {
			$("#idislike-" + ansId).addClass("fas");
			$("#idislike-" + ansId).removeClass("far");
		}
		ansLikeDislike(ansId, "dislike", dval[ansIdStr]);
		dval[ansIdStr] = -dval[ansIdStr];
	} else if (type == "d") {
		if (dval[ansIdStr] != null) {
		} else {
			dval[ansIdStr] = 1;
		}
		if (dval[ansIdStr] == -1) {
			$("#idislike-" + ansId).addClass("far");
			$("#idislike-" + ansId).removeClass("fas");
		} else {
			$("#idislike-" + ansId).addClass("fas");
			$("#idislike-" + ansId).removeClass("far");
		}
		ansLikeDislike(ansId, "dislike", dval[ansIdStr]);
		dval[ansIdStr] = -dval[ansIdStr];
	}
	// console.log(dval);
}

// Search Functionality
$(function () {
	$("#searchQues").autocomplete({
		source: function (req, res) {
			$.ajax({
				url: "/search/",
				dataType: "jsonp",
				type: "GET",
				data: req,
				success: function (data) {
					// console.log(data);
					res(data);
				},
				error: function (err) {
					console.log(err);
				},
			});
		},
		minLength: 1,
		select: function (event, ui) {
			if (ui.item) {
				$("#searchQues").val(ui.item.label);
				$("#searchBtn").val(ui.item.id);
			}

			window.open("/question/" + ui.item.id);
		},
	});
});

$(function () {
	$("#question").autocomplete({
		source: function (req, res) {
			$.ajax({
				url: "/search/",
				dataType: "jsonp",
				type: "GET",
				data: req,
				success: function (data) {
					res(data);
				},
				error: function (err) {
					console.log(err);
				},
			});
		},
		minLength: 1,
		select: function (event, ui) {
			if (ui.item) {
				$("#searchQues").val(ui.item.label);
				$("#searchBtn").val(ui.item.id);
			}
			window.location.href = "/question/" + ui.item.id;
		},
	});
});
