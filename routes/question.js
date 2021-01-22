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

const {
	ensureAuthenticated,
	forwardAuthenticated,
	adminAuthenticated,
} = require("../config/auth");
const { render } = require("ejs");

router.get("/:id", async (req, res) => {
	const reqId = req.params.id;

	const question = await Question.findOne({ _id: reqId });
	// console.log(question);
	const answers = await Answer.find({ _id: { $in: question.ansId } });
	const rel_ques = await Question.find({ category: question.category });
	// console.log(rel_ques);
	res.render("question", {
		question: question,
		answers: answers,
		rel_ques: rel_ques,
		title: null,
	});
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
	var reqId = req.params.id;
	const question = await Question.findOne({ _id: reqId });

	res.render("answer", { question: question, title: "Answer Page" });
});

router.post("/answer", async (req, res) => {
	// console.log(req.body);

	if (req.body.postBody == "") {
		// console.log("error");
		req.flash("error_msg", "Please enter all fields.");
		res.redirect("/question/answer/" + req.body.publish);
	}
	const newAns = new Answer({
		answer: req.body.postBody,
		answeredBy: req.user.username,
	});

	await newAns.save();

	await Question.findByIdAndUpdate(
		{ _id: req.body.publish },
		{ $push: { ansId: newAns._id } }
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

	// await comment.save();

	// console.log(comment);

	await Answer.findByIdAndUpdate(
		{ _id: req.body.commentbtn },
		{ $push: { comments: comment } }
	);

	res.redirect("/question/" + req.params.id);
});

module.exports = router;
