import mongoose from "mongoose";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    PhoneNumber: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: true,
    },
    // Updated academic fields
    branch: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: false, // Some branches might not have specialties
    },
    subjectType: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    verified: { type: Boolean, default: false },
    token: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = function () {
  console.log("this._id from user model = ", this._id);
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required().label("Name"),
    PhoneNumber: Joi.string().required().label("Phone Number"),
    gender: Joi.string().required().label("Gender"),
    role: Joi.string().required().label("Role"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    password2: Joi.string().required().label("Confirm Password").valid(Joi.ref("password")),
    // Updated validation for academic fields
    branch: Joi.string().required().label("Branch"),
    department: Joi.string().required().label("Department"),
    specialty: Joi.string().allow('').label("Specialty"), // Optional
    subjectType: Joi.string().required().label("Subject Type"),
    subject: Joi.string().required().label("Subject"),
  });
  return schema.validate(data);
};

const resetPasswordValidation = (data) => {
  const schema = Joi.object({
    password: passwordComplexity().required().label("New Password"),
  });
  return schema.validate(data);
};

export { User, validate, resetPasswordValidation };