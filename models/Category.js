const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
	categoryName: String,
	tags: [String],
});

const Category = mongoose.model("Category", categorySchema);
module.exports.categorySchema = categorySchema;
module.exports = Category;
