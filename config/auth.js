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
};
