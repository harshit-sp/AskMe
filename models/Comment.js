const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
	commentedBy: String,
	comment: String,
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
module.exports.commentSchema = commentSchema;
