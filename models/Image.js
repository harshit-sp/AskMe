const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
	foruser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	imagefile: { type: String, default: "default_profile.jpg" },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
module.exports.imageSchema = imageSchema;
