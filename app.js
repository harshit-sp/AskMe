const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var user = "HarshitSP";

questions = [{
        id: 1,
        postedBy: "HarshitSP",
        date: new Date("January 1, 2021 03:24:00"),
        question: "How can I implement 'read more' in my webpage?",
        answer: [{
                id: 1,
                answers: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
                answered_by: "John Doe",
                answered_date: new Date("January 3, 2021 03:24:00"),
            },
            {
                id: 2,
                answers: "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                answered_by: "CoreyMS",
                answered_date: new Date("January 11, 2021 03:24:00"),
            },
            {
                id: 3,
                answers: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
                answered_by: "John Doe",
                answered_date: new Date("January 3, 2021 03:24:00"),
            },
            {
                id: 4,
                answers: "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
        answer: [{
                id: 1,
                answers: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
                answered_by: "John Doe",
                answered_date: new Date("January 3, 2021 03:24:00"),
            },
            {
                id: 2,
                answers: "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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
        answer: [{
                id: 1,
                answers: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor",
                answered_by: "John Doe",
                answered_date: new Date("January 3, 2021 03:24:00"),
            },
            {
                id: 2,
                answers: "In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
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

app.get("/", (req, res) => {
    res.render("home", {
        questions: questions,
        user: user,
        category: "Technology",
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/about", (req, res) => {
    res.render("about", { user: user });
});

app.get("/question/:id", (req, res) => {
    const reqId = req.params.id;
    var question;

    questions.forEach((ques) => {
        if (ques.id == reqId) {
            question = ques;
        }
    });
    res.render("question", { question: question, user: user });
});

app.post("/", (req, res) => {
    console.log(req.body);
});

app.get("/comments", (req, res) => {
    res.render("comments");
});

app.get("/askquestion", (req, res) => {
    res.render("askques", { user: user });
});

app.get("/answer/:id", (req, res) => {
    var reqId = req.params.id;
    var question;

    questions.forEach((ques) => {
        if (ques.id == reqId) {
            question = ques;
        }
    });

    res.render("answer", { question: question, user: user });
});

app.get("/question/report/:id", (req, res) => {
    res.render("report", { user: user });
});

app.get("/profile", (req, res) => {
    var userdata = {
        username: "HarshitSP",
        email: "harshitsp@email.com",
        skills: ["Node JS", "CSS", "MongoDB"],
        img: "/media/default_profile.jpg",
    };

    res.render("profile", { userdata: userdata, user: user, cat: cat });
});

app.get("/addcategory", (req, res) => {
    res.render("adminpage", { user: user, cat: cat });
});

app.listen(3000, () => console.log("Server is up and running on port 3000."));