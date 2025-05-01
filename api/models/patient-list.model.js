import mongoose from "mongoose";
const { Schema } = mongoose;

const PatientListSchema = new Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientGender: {
      type: Number,
      default: 0,
    },
    sessions: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PatientList", PatientListSchema);
