const mongoose = require("mongoose");
const commentSchema = require("./Comment");

const answerSchema = new mongoose.Schema({
	answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	answer: String,
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	reportedCount: { type: Number, default: 0 },
	comments: [commentSchema.commentSchema],
});

const Answer = mongoose.Schema(Answer, answerSchema);
module.exports = Answer;
