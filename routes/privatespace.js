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
	// const questions = await Question.find({ isPrivate: true });
	// res.render("privatespacehome", {
	// 	questions: questions,
	// 	title: "Private Space",
	// });
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
