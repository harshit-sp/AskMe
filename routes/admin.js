const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const Category = require("../models/Category");
const Answer = require("../models/Answer");

const {
	ensureAuthenticated,
	forwardAuthenticated,
	adminAuthenticated,
} = require("../config/auth");
const User = require("../models/User");
const Question = require("../models/Question");

async function renderAdminPage(req, res, hasError = false, errors = null) {
	const cat = await Category.find({});
	if (hasError) {
		res.render("adminpage", {
			cat: cat,
			errors,
			title: "Admin",
		});
	} else {
		res.render("adminpage", {
			cat: cat,
			title: "Admin",
		});
	}
}

router.get("/", adminAuthenticated, async (req, res) => {
	renderAdminPage(req, res);
});

var errors = [];
router.post("/", async (req, res) => {
	Category.findOne({ categoryName: req.body.newcategory }).then(
		async (category) => {
			if (category) {
				// console.log(category);
				errors.push({ msg: "Category already exists." });
				renderAdminPage(req, res, true, errors);
				// res.redirect("/admin");
			} else {
				// console.log("else");
				const newCat = new Category({
					categoryName: req.body.newcategory,
				});
				await newCat.save();
				res.redirect("/admin");
			}
		}
	);
});

router.get("/manage", adminAuthenticated, async (req, res) => {
	const answers = await Answer.find({ reportedCount: { $gt: 0 } });
	const questions = await Question.find({ reportedCountQ: { $gt: 0 } });
	// console.log(answers);
	res.render("managereport", {
		title: "Manage Reports",
		answers: answers,
		questions: questions,
	});
});

router.post("/delete/:type/:id", async (req, res) => {
	if (req.params.type == "ans") {
		const ans = await Answer.findOne({ _id: req.params.id });
		const user = ans.givenby;
		await User.findOneAndUpdate(
			{ __id: ans.givenby },
			{
				$set: {
					$dec: { totallikes: ans.likes, totaldisLikes: ans.dislikes },
				},
			}
		);

		let a = await User.findOne({ _id: ans.givenby });
		await User.findOneAndUpdate(
			{ _id: ans.givenby },
			{ $inc: { quesReportedandDeleted: 1 } }
		);
		a = await User.findOne({ _id: ans.givenby });

		await Question.findByIdAndUpdate(
			{ _id: ans.ques },
			{ $pull: { ansId: ans._id } }
		);

		await Answer.findByIdAndDelete({ _id: req.params.id });

		const user1 = await User.findOne({ _id: user });
		// console.log(req.user._id, req.user.username);

		let like = user1.totalLikes;
		let dislike = user1.totaldisLikes;
		let quesAnswered = user1.quesAnswered;
		let quesReportedandDeleted = user1.quesReportedandDeleted;

		const score =
			5 * like +
			10 * quesAnswered -
			(10 * quesReportedandDeleted + 3 * dislike);

		await User.findOneAndUpdate({ _id: user }, { score: score });
	} else {
		const ques = await Question.findOne({ _id: req.params.id });
		const user = ques.postedby;

		await Question.findByIdAndDelete({ _id: req.params.id });
		// console.log("q", ques);
		// console.log("user", user);
		await User.findOneAndUpdate(
			{ _id: user },
			{ $set: { isBlocked: true, blockedTime: new Date() } }
		);
	}
	res.redirect("/admin/manage");
});

module.exports = router;
