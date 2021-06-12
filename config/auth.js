const User = require("../models/User");

module.exports = {
	ensureAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash("error_msg", "Please log in to view that resource");
		res.redirect("/login");
	},
	forwardAuthenticated: function (req, res, next) {
		if (!req.isAuthenticated()) {
			return next();
		}
		res.redirect("/");
	},
	adminAuthenticated: function (req, res, next) {
		if (req.isAuthenticated()) {
			if (req.user.isAdmin) {
				next();
			} else {
				req.flash("error_msg", "Error! You are accessing Admin Panel.");
				res.redirect("/");
			}
		} else {
			req.flash("error_msg", "Please log in to view that resource");
			res.redirect("/login");
		}
	},
	blockAuth: async function (req, res, next) {
		if (req.isAuthenticated()) {
			console.log(req.user.username, req.user.isBlocked);
			if (req.user.isBlocked) {
				console.log(
					"new Date() - req.user.blockedTime",
					new Date(),
					req.user.blockedTime
				);
				if (new Date() - req.user.blockedTime > 45000) {
					await User.findOneAndUpdate(
						{ _id: req.user._id },
						{ $set: { isBlocked: false } }
					);
					return next();
				} else {
					res.redirect("/blocked");
				}
			} else {
				console.log("dqkdgdg");
			}
			return next();
		}
	},
};
