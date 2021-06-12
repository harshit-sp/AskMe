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
		// console.log(data.change);
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
					console.log(data);
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

// ============================== SEARCH ==============================

const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input"); // <=> document.querySelector("#search-form input");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition =
	window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined

if (SpeechRecognition) {
	// searchForm.insertAdjacentHTML(
	// 	"afterend",
	// 	'<button class="btn btn-primary" type="button"><i class="fas fa-microphone"></i></button>'
	// );
	console.log("Your Browser supports speech Recognition");

	const recognition = new SpeechRecognition();
	recognition.continuous = true;
	// recognition.lang = "en-US";

	searchFormInput.style.paddingRight = "50px";

	const micBtn = searchForm.querySelector("button");
	const micIcon = micBtn.firstElementChild;

	micBtn.addEventListener("click", micBtnClick);
	function micBtnClick() {
		if (micIcon.classList.contains("fa-microphone")) {
			// Start Voice Recognition
			recognition.start(); // First time you have to allow access to mic!
		} else {
			// console.log("end");
			recognition.stop();
		}
	}

	recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
	function startSpeechRecognition() {
		$(".micro").removeClass("fa-microphone");
		// micIcon.classList.remove("fa-microphone");
		$(".micro").addClass("fa-microphone-slash");
		// micIcon.classList.add("fa-microphone-slash");
		searchFormInput.focus();
		console.log("Voice activated, SPEAK");
	}

	recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
	function endSpeechRecognition() {
		// micIcon.classList.remove("fa-microphone-slash");
		// micIcon.classList.add("fa-microphone");
		$(".micro").addClass("fa-microphone");
		// micIcon.classList.remove("fa-microphone");
		$(".micro").removeClass("fa-microphone-slash");
		searchFormInput.focus();
		console.log("Speech recognition service disconnected");
	}

	recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
	function resultOfSpeechRecognition(event) {
		const current = event.resultIndex;
		const transcript = event.results[current][0].transcript;

		// if (transcript.toLowerCase().trim() === "stop recording") {
		// 	recognition.stop();
		// } else if (!searchFormInput.value) {
		// 	searchFormInput.value = transcript;
		// } else {
		// 	if (transcript.toLowerCase().trim() === "go") {
		// 		searchForm.submit();
		// 	} else if (transcript.toLowerCase().trim() === "reset input") {
		// 		searchFormInput.value = "";
		// 	} else {
		searchFormInput.value = transcript;
		// 	}
		// }
		// searchFormInput.value = transcript;
		searchQuestion(transcript);
		recognition.stop();
		// searchFormInput.value = transcript;
		// searchFormInput.focus();
		// setTimeout(() => {
		// 	searchForm.submit();
		// }, 500);
	}

	// info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
} else {
	console.log("Your Browser does not support speech Recognition");
	// info.textContent = "Your Browser does not support Speech Recognition";
}

function searchQuestion(saidText) {
	console.log(saidText);

	$.ajax({
		url: "/searchQuestion/",
		dataType: "jsonp",
		type: "GET",
		data: { saidText: saidText },
		success: function (data) {
			console.log(data);
			$(".bb").empty();

			$(".bb").append(
				`<h3>Search Results for ${
					saidText[0].toUpperCase() + saidText.slice(1)
				} (${data.length})</h3><hr>`
			);

			var html = "";
			data.forEach((d) => {
				html += `<article class="media content-section">
				<img
					class="rounded-circle article-img"
					src="/uploads/profilepics/${d.postedby.img.imagefile}"
				/>
				<div class="media-body">
					<div class="article-metadata border-bottom">
						<a style="color: #626ee3" class="mr-2">
							${d.owner}
						</a>

					</div>
					<h5>
						<a class="article-title" href="/question/${d._id}">
							${d.ques}
						</a>
					</h5>
				</div>
			</article>`;
			});
			$(".bb").append(html);
		},
		error: function (err) {
			console.log(err);
		},
	});

	// minLength: 1,
	// select: function (event, ui) {
	// 	if (ui.item) {
	// 		$("#searchQues").val(ui.item.label);
	// 		$("#searchBtn").val(ui.item.id);
	// 	}

	// 	window.open("/question/" + ui.item.id);
	// }
}
