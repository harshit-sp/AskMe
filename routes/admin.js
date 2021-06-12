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
	// console.log(answers);
	res.render("managereport", { title: "Manage Reports", answers: answers });
});

router.post("/delete/:id", async (req, res) => {
	const ans = await Answer.findOne({ _id: req.params.id });
	// console.log("ans", ans);

	await User.findOneAndUpdate(
		{ __id: ans.givenby },
		{
			$set: {
				$dec: { totallikes: ans.likes, totaldisLikes: ans.dislikes },
			},
		}
	);

	let a = await User.findOne({ _id: ans.givenby });
	console.log(a);
	await User.findOneAndUpdate(
		{ _id: ans.givenby },
		{ $inc: { quesReportedandDeleted: 1 } }
	);
	a = await User.findOne({ _id: ans.givenby });
	console.log(a);

	await Question.findByIdAndUpdate(
		{ _id: ans.ques },
		{ $pull: { ansId: ans._id } }
	);

	await Answer.findByIdAndDelete({ _id: req.params.id });

	res.redirect("/admin/manage");
});

module.exports = router;
