const mongoose = require("mongoose");
const categorySchema = require("./Category");

const questionSchema = new mongoose.Schema({
	ques: String,
	postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	postedDate: Date.now,
	ansId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
	category: categorySchema.categorySchema,
});

const Question = mongoose.Schema("Question", questionSchema);
module.exports = Question;
