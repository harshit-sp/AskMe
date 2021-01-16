const express = require("express");
const router = express.Router();

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

router.get("/", (req, res) => {
    res.render("home", {
        questions: questions,
        user: user,
        category: "Technology",
    });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/about", (req, res) => {
    res.render("about", { user: user });
});

module.exports = router;