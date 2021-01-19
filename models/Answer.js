const mongoose = require("mongoose");
const commentSchema = require("./Comment");

const answerSchema = new mongoose.Schema({
	answeredBy: String,
	answer: String,
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	reportedCount: { type: Number, default: 0 },
	postedDate: { type: Date, default: Date.now },
	comments: [commentSchema.commentSchema],
});

const Answer = mongoose.model("Answer", answerSchema);
module.exports = Answer;
