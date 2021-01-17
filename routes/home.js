const express = require("express");
const router = express.Router();
const validator = require("validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
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
const Category = require("../models/Category");

var user = "HarshitsP";

questions = [
	{
		id: 1,
		postedBy: "HarshitSP",
		date: new Date("January 1, 2021 03:24:00"),
		question: "How can I implement 'read more' in my webpage?",
		answer: [
			{
				id: 1,
				answers:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
				answered_by: "John Doe",
				answered_date: new Date("January 3, 2021 03:24:00"),
			},
			{
				id: 2,
				answers:
					"In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				answered_by: "CoreyMS",
				answered_date: new Date("January 11, 2021 03:24:00"),
			},
			{
				id: 3,
				answers:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
				answered_by: "John Doe",
				answered_date: new Date("January 3, 2021 03:24:00"),
			},
			{
				id: 4,
				answers:
					"In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				answered_by: "CoreyMS",
				answered_date: new Date("January 11, 2021 03:24:00"),
			},
		],
	},
	{
		id: 2,
		postedBy: "John Doe",
		date: new Date("January 11, 2021 03:24:00"),
		question: "How do I find the date of the Webpage?",
		answer: [
			{
				id: 1,
				answers:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
				answered_by: "John Doe",
				answered_date: new Date("January 3, 2021 03:24:00"),
			},
			{
				id: 2,
				answers:
					"In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				answered_by: "CoreyMS",
				answered_date: new Date("January 11, 2021 03:24:00"),
			},
		],
	},
	{
		id: 3,
		postedBy: "CoreyMS",
		date: new Date("January 5, 2021 03:24:00"),
		question: "How do I add text to my existing webpage?",
		answer: [
			{
				id: 1,
				answers:
					"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
				answered_by: "John Doe",
				answered_date: new Date("January 3, 2021 03:24:00"),
			},
			{
				id: 2,
				answers:
					"In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
				answered_by: "CoreyMS",
				answered_date: new Date("January 11, 2021 03:24:00"),
			},
		],
	},
];

var cat = [
	"Business",
	"Finance",
	"Technology",
	"Mechanical",
	"Android",
	"iOS",
	"News",
	"Politics",
];

router.get("/", (req, res) => {
	// console.log(req.user);
	res.render("home", {
		questions: questions,
		category: "Technology",
	});
});

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
							.then((user) => {
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

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/login");
});

router.get("/about", (req, res) => {
	res.render("about", { user: user });
});

router.get("/profile", ensureAuthenticated, async (req, res) => {
	const userdata = await User.findOne({ _id: req.user._id });
	const cat = await Category.find({});
	res.render("profile", { userdata: userdata, cat: cat });
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
			// console.log(filename);
			await User.findByIdAndUpdate(
				{ _id: req.user._id },
				{ img: filename }
			);
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

module.exports = router;
