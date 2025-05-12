import mongoose from "mongoose";

const PullSchema = new mongoose.Schema(
	{
		project: {
			type: String,
			required: true,
		},
		projectURL: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		createdBy: {
			type: String,
			ref: "Contributor",
		},
		pullURL: {
			type: String,
			required: true,
			unique: true,
		},
		status: {
			type: String,
			enum: ["open", "merged", "closed"],
			required: true,
		},
		labels: {
			type: [String],
			default: [],
		},
	},
	{ timestamps: true }
);

export { PullSchema };

const PullModel = mongoose.model("Pull", PullSchema);

export default PullModel;
