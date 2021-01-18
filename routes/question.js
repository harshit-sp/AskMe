const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Models
const Category = require("../models/Category");
const User = require("../models/User");
const Question = require("../models/Question");

const {
	ensureAuthenticated,
	forwardAuthenticated,
	adminAuthenticated,
} = require("../config/auth");

router.get("/:id", async (req, res) => {
	const reqId = req.params.id;

	const question = await Question.findOne({ _id: reqId });
	console.log(question);

	res.render("question", { question: question, title: null });
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
		title: null,
	});
});

module.exports = router;
