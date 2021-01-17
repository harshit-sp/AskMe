const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	username: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false },
	skills: [String],
	interests: [String],
	img: { type: String, default: "default_profile.jpg" },
	score: { type: Number, default: 0 },
	totalLikes: { type: Number, default: 0 },
	quesPosted: { type: Number, default: 0 },
	quesAnswered: { type: Number, default: 0 },
	rank: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
