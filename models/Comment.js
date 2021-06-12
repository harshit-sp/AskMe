const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	comment: String,
});

module.exports.commentSchema = commentSchema;
const Comment = mongoose.Schema(Comment, commentSchema);
module.exports = Comment;
