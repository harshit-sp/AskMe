const mongoose = require("mongoose");
const imageSchema = require("./Image");

const questionSchema = new mongoose.Schema({
	ques: String,
	postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	owner: String,
	userimg: String,
	postedDate: { type: Date, default: Date.now },
	ansId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
	category: String,
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
