import mongoose from "mongoose";

const ContributorSchema = new mongoose.Schema({
	githubID: {
		type: String,
		required: true,
		unique: true,
		index: true,
	},
});

const ContributorModel = mongoose.model("Contributor", ContributorSchema);

export default ContributorModel;
