const mongoose = require("mongoose");
const imageSchema = require("./Image");
const reportSchema = require("./Report");

const questionSchema = new mongoose.Schema({
	ques: String,
	postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	owner: String,
	// userimg: String,
	postedDate: { type: Date, default: Date.now },
	ansId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
	category: String,
	reasonsQ: [reportSchema.reportSchema],
	reportedCountQ: { type: Number, default: 0 },
	isPrivate: { type: Boolean, default: false },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
