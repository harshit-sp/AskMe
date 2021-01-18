const mongoose = require("mongoose");
const categorySchema = require("./Category");

const questionSchema = new mongoose.Schema({
	ques: String,
	postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	owner: String,
	postedDate: { type: Date, default: Date.now },
	ansId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
	category: String,
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
