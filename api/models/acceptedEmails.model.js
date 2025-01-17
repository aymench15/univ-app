import mongoose from "mongoose";
const { Schema } = mongoose;
const EmailsSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});
export default mongoose.model("Emails", EmailsSchema);
