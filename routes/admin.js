const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const Category = require("../models/Category");

const {
	ensureAuthenticated,
	forwardAuthenticated,
	adminAuthenticated,
} = require("../config/auth");

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

module.exports = router;
