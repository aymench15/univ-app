import mongoose from "mongoose";
const { Schema } = mongoose;
const documentSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  cloudinaryUrl: { type: String, required: true },
  note: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Document", documentSchema);
