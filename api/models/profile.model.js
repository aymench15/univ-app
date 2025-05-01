import mongoose from "mongoose";
const { Schema } = mongoose;

const profileSchema = new Schema(
	{
		img: {
			type: String,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model("Profile", profileSchema);
