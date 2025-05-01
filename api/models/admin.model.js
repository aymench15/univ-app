import mongoose from "mongoose";
const { Schema } = mongoose;
const adminSchema = new Schema({
  password: { type: String, required: true },
  img: { type: String, required: false },
  name: { type: String, required: true, unique: true },
},
  {
    timestamps: true,
  });
export default mongoose.model("Admin", adminSchema);
