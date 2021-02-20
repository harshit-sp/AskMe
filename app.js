const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

const Category = require("./models/Category");

const app = express();

const passportConfig = require("./config/passport");
passportConfig(passport);

const { ensureAuthenticated } = require("./config/auth");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		secret: "secret",
		resave: true,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

mongoose.connect("mongodb://localhost:27017/testDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

app.use(function (req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.login = req.isAuthenticated();
	next();
});

app.use(function (req, res, next) {
	// console.log(req.user);
	if (req.isAuthenticated()) {
		res.locals.admin = req.user.isAdmin;
	}
	next();
});

const indexRouter = require("./routes/home");
app.use("/", indexRouter);

const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

const questionRouter = require("./routes/question");
app.use("/question", questionRouter);

const privateSpaceRouter = require("./routes/privatespace");
app.use("/privatespace", privateSpaceRouter);

// app.get("/", (req, res) => {
//     res.render("home", {
//         questions: questions,
//         user: user,
//         category: "Technology",
//     });
// });

// app.get("/login", (req, res) => {
//     res.render("login");
// });

// app.get("/register", (req, res) => {
//     res.render("register");
// });

// app.get("/about", (req, res) => {
//     res.render("about", { user: user });
// });

// app.get("/question/:id", (req, res) => {
// 	const reqId = req.params.id;
// 	var question;

// 	questions.forEach((ques) => {
// 		if (ques.id == reqId) {
// 			question = ques;
// 		}
// 	});
// 	res.render("question", { question: question, title: null });
// });

// app.post("/", (req, res) => {
// 	console.log(req.body);
// });

// app.get("/comments", (req, res) => {
// 	res.render("comments");
// });

// app.get("/askquestion", async (req, res) => {
// 	const categories = await Category.find({});
// 	res.render("askques", { categories: categories, title: "Post Question" });
// });

// app.get("/answer/:id", (req, res) => {
// 	var reqId = req.params.id;
// 	var question;

// 	questions.forEach((ques) => {
// 		if (ques.id == reqId) {
// 			question = ques;
// 		}
// 	});

// 	res.render("answer", { question: question, title: "Answer Page" });
// });

// app.get("/question/report/:id", (req, res) => {
// 	res.render("report", { title: "Report" });
// });

app.listen(3000, () => console.log("Server is up and running on port 3000."));
