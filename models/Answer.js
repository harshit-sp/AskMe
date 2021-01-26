const mongoose = require("mongoose");
const commentSchema = require("./Comment");
const reportSchema = require("./Report");

const answerSchema = new mongoose.Schema({
	ques: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
	answeredBy: String,
	givenby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	answer: String,
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	reasons: [reportSchema.reportSchema],
	userimg: String,
	reportedCount: { type: Number, default: 0 },
	postedDate: { type: Date, default: Date.now },
	comments: [commentSchema.commentSchema],
});

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
