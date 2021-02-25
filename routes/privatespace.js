const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const path = require("path");

// Models
const Category = require("../models/Category");
const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Comment = require("../models/Comment");
const Image = require("../models/Image");
const Report = require("../models/Report");

var questions = [
	{
		ques: "Ques01",
	},
	{
		ques: "Ques02",
	},
	{
		ques: "Ques03",
	},
];

const {
	ensureAuthenticated,
	forwardAuthenticated,
	blockAuth,
} = require("../config/auth");

router.get("/", ensureAuthenticated, async (req, res) => {
	const questions = await Question.find({ isPrivate: true });
	res.render("privatespacehome", {
		questions: questions,
		title: "Private Space",
	});
});

router.get("/question/:id", ensureAuthenticated, async (req, res) => {
	const reqId = req.params.id;

	const question = await Question.findOne({ _id: reqId });

	const answers = await Answer.find({
		_id: { $in: question.ansId },
	});

	if (req.isAuthenticated()) {
		const user = await User.findOne({ _id: req.user._id });
		res.render("privatequestionanswer", {
			question: question,
			answers: answers,
			title: null,
			user: user,
		});
	} else {
		res.render("privatequestionanswer", {
			question: question,
			answers: answers,
			title: null,
		});
	}
});

router.get("/privatequestion", ensureAuthenticated, (req, res) => {
	res.render("privatequestion", {
		title: "Private Question",
	});
});

router.post("/privatequestion", ensureAuthenticated, async (req, res) => {
	const question = req.body.postBody;

	const newques = new Question({
		ques: question,
		postedby: req.user._id,
		owner: req.user.username,
		isPrivate: true,
	});

	await newques.save();

	res.redirect("/privatespace");
});

module.exports = router;
