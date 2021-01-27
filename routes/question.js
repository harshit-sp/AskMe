const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Models
const Category = require("../models/Category");
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Comment = require("../models/Comment");
const Image = require("../models/Image");
const Report = require("../models/Report");

const {
	ensureAuthenticated,
	forwardAuthenticated,
	adminAuthenticated,
} = require("../config/auth");
const { render } = require("ejs");

router.get("/:id", async (req, res) => {
	const reqId = req.params.id;

	const question = await Question.findOne({ _id: reqId }).populate({
		path: "postedby",
		populate: { path: "img" },
	});
	// console.log(question);
	// const answers = await Answer.find({ _id: { $in: question.ansId } });

	const answers = await Answer.find().populate({
		path: "givenby",
		populate: { path: "img" },
	});

	// console.log("answers", answers);
	const rel_ques = await Question.find({ category: question.category });
	if (req.isAuthenticated()) {
		const user = await User.findOne({ _id: req.user._id });
		res.render("question", {
			question: question,
			answers: answers,
			rel_ques: rel_ques,
			title: null,
			user: user,
		});
	} else {
		res.render("question", {
			question: question,
			answers: answers,
			rel_ques: rel_ques,
			title: null,
		});
	}
});

router.get("/category/:category", async (req, res) => {
	const reqCat = req.params.category;
	// console.log(reqCat);
	let questions;
	if (reqCat == "All") {
		questions = await Question.find();
	} else {
		questions = await Question.find({ category: reqCat });
	}

	// console.log(questions);

	const categories = await Category.find({});
	res.render("home", {
		questions: questions,
		categories: categories,
		category: reqCat,
		title: null,
	});
});

router.get("/answer/:id", ensureAuthenticated, async (req, res) => {
	const ques = await Question.findOne({ _id: req.params.id });

	if (String(ques.postedby) == String(req.user._id)) {
		req.flash("error_msg", "You cannot answer your own question.");

		res.redirect("/question/" + req.params.id);
	}
	var reqId = req.params.id;
	const question = await Question.findOne({ _id: reqId });

	res.render("answer", { question: question, title: "Answer Page" });
});

router.post("/answer/:id", async (req, res) => {
	// console.log(req.body);

	if (req.body.postBody == "") {
		// console.log("error");
		req.flash("error_msg", "Please enter all fields.");
		res.redirect("/question/answer/" + req.body.publish);
	}
	// const img = await Image.findOne({ foruser: req.user._id });
	const newAns = new Answer({
		ques: req.params.id,
		givenby: req.user._id,
		answer: req.body.postBody,
		answeredBy: req.user.username,
		// userimg: img.imagefile,
	});

	await newAns.save();

	await Question.findByIdAndUpdate(
		{ _id: req.body.publish },
		{ $push: { ansId: newAns._id } }
	);

	await User.findOneAndUpdate(
		{ _id: req.user._id },
		{ $inc: { quesAnswered: 1 } }
	);

	// console.log(newAns);
	res.redirect("/question/" + req.body.publish);
});

router.post("/answer/comments/:id", ensureAuthenticated, async (req, res) => {
	// console.log(req.user.username);
	const comment = new Comment({
		commentedBy: req.user.username,
		comment: req.body.comment,
	});

	await Answer.findByIdAndUpdate(
		{ _id: req.body.commentbtn },
		{ $push: { comments: comment } }
	);

	res.redirect("/question/" + req.params.id);
});

router.get("/answer/:type/:id/:val", async (req, res) => {
	const { type, id, val } = req.params;

	let ans;
	let result;
	if (type == "like") {
		await Answer.findOneAndUpdate({ _id: id }, { $inc: { likes: val } });
		if (val == 1) {
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $addToSet: { likedans: id } }
			);
		} else {
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $pull: { likedans: id } }
			);
		}
		ans = await Answer.findOne({ _id: req.params.id });
		result = ans.likes;
	} else {
		await Answer.findOneAndUpdate({ _id: id }, { $inc: { dislikes: val } });
		if (val == 1) {
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $addToSet: { dislikedans: id } }
			);
		} else {
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $pull: { dislikedans: id } }
			);
		}
		ans = await Answer.findOne({ _id: req.params.id });
		result = ans.dislikes;
	}
	res.status(200).send({ result: result });
});

router.get("/report/:qid/:id", ensureAuthenticated, async (req, res) => {
	const ans = await Answer.findOne({ _id: req.params.id });

	if (String(ans.givenby) == String(req.user._id)) {
		req.flash("error_msg", "You cannot report your own answer.");

		res.redirect("/question/" + req.params.qid);
	}
	res.render("report", {
		title: "Report",
		id: req.params.id,
		qid: req.params.qid,
	});
});

router.post("/report/:qid/:id", async (req, res) => {
	// console.log(req.body);

	const ans = await Answer.findOne({ _id: req.params.id });
	let execute = true;
	if (String(ans.givenby) == String(req.user._id)) {
		execute = false;
		req.flash("error_msg", "You cannot report your own answer.");

		res.redirect("/question/" + req.params.qid);
	}

	const rr = ans.reasons;

	rr.forEach((r) => {
		execute = false;
		// console.log("r", r);
		// console.log(req.user._id);
		// console.log(r.reportedby);
		// console.log(String(r.reportedby) == String(req.params._id));
		if (String(r.reportedby) == String(req.user._id)) {
			req.flash("error_msg", "You can report only once.");

			res.redirect("/question/" + req.params.qid);
		}
	});

	if (execute) {
		const reason = new Report({
			reportedby: req.user._id,
			report: req.body.report,
		});

		await reason.save();

		await Answer.findByIdAndUpdate(
			{ _id: req.params.id },
			{ $push: { reasons: reason }, $inc: { reportedCount: 1 } }
		);
	}

	res.redirect("/question/" + req.params.qid);
});

module.exports = router;
