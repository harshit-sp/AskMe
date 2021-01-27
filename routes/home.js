// Imports
const express = require("express");
const router = express.Router();
const validator = require("validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// For storing images
const path = require("path");
const multer = require("multer");
const uploadPath = path.join("public", "uploads/profilepics");
const imageMimeType = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
	dest: uploadPath,
	fileFilter: (req, file, callback) => {
		// console.log(file);
		callback(null, imageMimeType.includes(file.mimetype));
	},
});

const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// Models
const Category = require("../models/Category");
const User = require("../models/User");
const Question = require("../models/Question");
const Image = require("../models/Image");
const Answer = require("../models/Answer");
const { config } = require("process");

// Home config
router.get("/", async (req, res) => {
	const questions = await Question.find({}).populate({
		path: "postedby",
		populate: { path: "img" },
	});
	// console.log(questions);
	const categories = await Category.find({});
	res.render("home", {
		questions: questions,
		category: "All",
		categories: categories,
		title: null,
	});
});

// Login config
router.get("/login", forwardAuthenticated, (req, res) => {
	res.render("login");
});

router.post("/login", (req, res, next) => {
	// console.log(req.body);
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	})(req, res, next);
});

// Register config
router.get("/register", forwardAuthenticated, (req, res) => {
	res.render("register");
});

router.post("/register", (req, res) => {
	let errors = [];
	const { username, email, password, confirmpass } = req.body;

	if (!username || !email || !password || !confirmpass) {
		errors.push({ msg: "Please fill in all fields." });
	} else {
		if (!validator.isEmail(email)) {
			errors.push({ msg: "Please enter valid email." });
		}

		if (password != confirmpass) {
			errors.push({ msg: "Passwords do not match" });
		}

		if (password.length < 6) {
			errors.push({ msg: "Password must be at least 6 characters" });
		}
	}

	if (errors.length > 0) {
		res.render("register", {
			errors: errors,
			username,
			email,
		});
	} else {
		User.findOne({ email: email }).then((user) => {
			if (user) {
				errors.push({ msg: "Email is already registered." });
				res.render("register", {
					errors: errors,
					username,
					email,
				});
			} else {
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(password, salt, (err, hash) => {
						if (err) throw err;

						const newUser = new User({
							username: username,
							email: email,
							password: hash,
						});
						newUser
							.save()
							.then(async (user) => {
								const i = new Image({ foruser: user._id });
								i.save();
								// console.log(user);
								user.img = i;
								// console.log(user);
								await user.save();
								req.flash(
									"success_msg",
									"You are now Registered and can Log In."
								);
								res.redirect("/login");
							})
							.catch((err) => console.log(err));
					});
				});
			}
		});
	}
});

// Logout config
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/login");
});

// Profile config
router.get("/profile", ensureAuthenticated, async (req, res) => {
	const ans = await Answer.find({ givenby: req.user._id });

	// console.log(ans);
	let likes = 0;
	let dislikes = 0;

	ans.forEach((a) => {
		likes += a.likes;
		dislikes += a.dislikes;
	});

	// console.log(likes);

	await User.findOneAndUpdate(
		{ _id: req.user._id },
		{ $set: { totalLikes: likes, totaldisLikes: dislikes } }
	);

	const userdata = await User.findOne({ _id: req.user._id }).populate("img");
	// console.log(userdata);
	const cat = await Category.find({});
	// const img = await Image.findOne({ _id: userdata.img });

	res.render("profile", {
		userdata: userdata,
		cat: cat,
		title: "Profile",
		// img: img,
	});
});

router.post(
	"/profile/update",
	upload.single("propic"),
	ensureAuthenticated,
	async (req, res) => {
		// console.log(req.body);
		const filename = req.file != null ? req.file.filename : null;

		const { username, skills, interests, removebtn, skillbtn } = req.body;

		if (filename) {
			await Image.findOneAndUpdate(
				{ _id: req.user.img._id },
				{ imagefile: filename }
			);

			// await Question.updateMany(
			// 	{ postedby: req.user._id },
			// 	{ userimg: filename }
			// );

			// await Answer.updateMany(
			// 	{ givenby: req.user._id },
			// 	{ userimg: filename }
			// );
		}

		if (removebtn) {
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $pull: { interests: removebtn } }
			);
		}

		if (skillbtn) {
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $pull: { skills: skillbtn } }
			);
		}

		if (username) {
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ username: username }
			);
		}

		if (skills) {
			var skill = skills.split(",").map((item) => item.trim());
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ skills: skill }
			);
		}

		if (interests) {
			var interest;
			if (typeof interests == "string") {
				interest = interests.split();
			} else {
				interest = interests;
			}
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ $push: { interests: { $each: interest } } }
			);
		}

		res.redirect("/profile");
	}
);

// Ask Question config
router.get("/askquestion", ensureAuthenticated, async (req, res) => {
	const categories = await Category.find({});
	res.render("askques", { categories: categories, title: "Post Question" });
});

router.post("/askquestion", async (req, res) => {
	// console.log(req.body);
	const { question, tags, categoryid } = req.body;
	var tag = tags.split(",").map((item) => item.trim());

	// console.log({ question, tags, categoryid });
	const cat = await Category.find({ _id: categoryid });
	// console.log("cat", cat[0].categoryName);

	// Inserting Question to the database.
	// const img = await Image.findOne({ foruser: req.user._id });
	const newques = new Question({
		ques: question,
		postedby: req.user._id,
		category: cat[0].categoryName,
		owner: req.user.username,
		// userimg: img.imagefile,
	});

	await newques.save();

	Category.findOneAndUpdate(
		{ _id: categoryid },
		{ $addToSet: { tags: { $each: tag } } },
		(err, success) => {
			if (err) {
				console.log(err);
			} else {
				console.log(success);
			}
		}
	);

	await User.findOneAndUpdate(
		{ _id: req.user._id },
		{ $inc: { quesPosted: 1 } }
	);

	req.flash("success_msg", "Your question is posted successfully");
	res.redirect("/");
});

// About config
router.get("/about", (req, res) => {
	res.render("about", { title: "About Us" });
});

// Contact config
router.get("/contact", (req, res) => {
	res.render("contact", { title: "Contact" });
});

module.exports = router;
