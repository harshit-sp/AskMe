const mongoose = require("mongoose");
const imageSchema = require("./Image");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false },
	skills: [String],
	interests: [String],
	img: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
	score: { type: Number, default: 0 },
	likedans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
	dislikedans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
	totalLikes: { type: Number, default: 0 },
	totaldisLikes: { type: Number, default: 0 },
	quesPosted: { type: Number, default: 0 },
	quesReportedandDeleted: { type: Number, default: 0 },
	quesAnswered: { type: Number, default: 0 },
	isBlocked: { type: Boolean, default: false },
	blockedTime: { type: Date },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
