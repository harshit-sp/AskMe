const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
	reportedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	report: String,
});

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
module.exports.reportSchema = reportSchema;
