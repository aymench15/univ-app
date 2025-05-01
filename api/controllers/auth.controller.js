import { User, validate } from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import { Token } from "../models/token.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordValidation } from "../models/user.model.js";
import Emails from "../models/acceptedEmails.model.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res, next) => {
  try {

    const allowedEmail = await Emails.findOne({ email: req.body.email });
    if (!allowedEmail) {
      return res.status(400).send({ message: "This email cannot register" });
    }

 
    const { error } = validate(req.body);
    console.log("err : ", error);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      if (existingUser.verified)
        return res.status(400).send({ message: "Email already exists" });
      return res.status(400).send({
        message: "Email already exists and we sent a verification email",
      });
    }

    const hash = bcrypt.hashSync(req.body.password, 5);

  
    const newUser = new User({
      ...req.body,
      password: hash,
    });


    let photoUrl = null;
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file);
      photoUrl = result.url;

      if (!photoUrl.startsWith("https")) {
        newUser.img = photoUrl.replace("http", "https");
      } else {
        newUser.img = photoUrl;
      }
    }


    const u = await newUser.save();

 
    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    
    if (req.body.role !== "doctor") {
      const verificationUrl = `${process.env.BASE_URL}api/users/${newUser._id}/verify/${token.token}`;
      const emailContent = `
        <div style="text-align: center;">
          <img src="https://res.cloudinary.com/diawojtfk/image/upload/v1736643192/fxkpbqlqrmu6ay58sp6v.png" alt="UMKB Logo" style="width: 100px; height: auto;"><br><br>
          Dear ${newUser.name},<br>
          Thank you for registering.<br><br>
          To complete your registration, please verify your email by clicking on the following button:<br><br>
          <a href="${verificationUrl}" style="text-decoration: none; color: white; background-color: green; padding: 10px 20px; border-radius: 20px; text-align: center; display: inline-block;">Verify Email</a><br><br>
          If you have any questions or need further assistance, please don't hesitate to contact us.<br>
          Best regards,<br>
          ----------------<br>
          <b>UMKB</b><br>
        </div>`;
      await sendEmail(newUser.email, "Email Verification UMKB", emailContent);
    }

    res
      .status(201)
      .send({ message: "An Email sent to your account, please verify" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).send({ message: "An error occurred during registration" });
  }
};

const createToken = (user) => {
  delete user.password;
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      user: {
        id: user._id,
      },
    },
    process.env.JWT_KEY
  );
};
const createAdminToken = (user) => {
  delete user.password;
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      user: {
        id: user._id,
      },
    },
    process.env.ADMIN_JWT_KEY
  );
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, { message: "User not found!" }));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, { message: "Wrong password or email!" }));

    if (!user.verified) {
      return next(
        createError(403, {
          message:
            "User account not verified! We sent a verification message to your email",
        })
      );
    }

    const token = createToken(user);

    const { password, ...info } = user._doc;
    // req.session.accessToken = token;

    if (user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: user._id });
      if (!doctorProfile.isVerified)
        return next(
          createError(403, {
            message: "Your account not verified! Under process...",
          })
        );
      if (!doctorProfile)
        return next(createError(404, { message: "Doctor profile not found!" }));

      return res.status(200).json({
        info: { ...info, doctorProfile },
        token,
        message: "Login successful",
      });
    } else {
      res.status(200).json({
        info,
        token,
        message: "Login successful",
      });
    }
  } catch (err) {
    next(err);
  }
};

export const load = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const token = createToken(user);

    return res.status(200).json({
      info: user,
      token,
      message: "Load successful",
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

// export const loadDoctor = async (req, res) => {
//   try {
//     console.log("req user id: ", req?.user?.id);
//     const user = await User.findById(req.user.id).select("-password");
//     const token = createToken(user);
//     return res.json({ message: "Load successful", token, info: user });
//   } catch (err) {
//     console.error(err.message);
//     return res.status(500).send("Server Error");
// };

// }

export const loadAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const token = createAdminToken({
      _id: admin._id,
      role: "admin",
    });

    // Set token in cookie if using cookie-based auth
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    return res.json({ 
      message: "Load successful", 
      token, 
      info: admin 
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    sameSite: "none",
    secure: true,
  });
  res.status(200).send({ message: "User has been logged out." });
};

export const adminLogin = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const admin = await Admin.findOne({
      name,
    });

    if (!admin) {
      return next(createError(404, { message: "Admin not found!" }));
    }

    const isCorrect = bcrypt.compareSync(password, admin.password);
    if (!isCorrect) {
      return next(createError(400, { message: "Wrong password!" }));
    }

    const token = createAdminToken({
      _id: admin._id,
      role: "admin",
    });

    return res.status(200).json({
      message: "Admin login successful",
      token,
      role: "admin",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const adminRegister = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const hash = bcrypt.hashSync(password, 5);

    const admin = new Admin({
      name,
      password: hash,
    });

    await admin.save();

    return res.status(200).json({
      message: "Admin registered successfully",
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(createError(403, { message: "User not found" }));
    }
    if (!user.verified) {
      return next(
        createError(403, {
          message:
            "User not verified !, You have to verify your account then reset your password",
        })
      );
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "10m",
    });

    user.token = token;
    await user.save();
    const resetPasswordLink = `${process.env.BASE_URL}resetpassword/${token}`;
    const text = `
    <div style="text-align: center;">
    <img src="https://res.cloudinary.com/diawojtfk/image/upload/v1736643192/fxkpbqlqrmu6ay58sp6v.png" alt="UMKB Logo" style="width: 100px; height: auto;"><br><br>
    <h1>Reset Your Password</h1>
    <p>Click on the following button to reset your password  :</p>
    <a href="${resetPasswordLink}" style="text-decoration: none; color: white; background-color: green; padding: 10px 20px; border-radius: 20px; text-align: center; display: inline-block;">Reset Password</a><br>
    <p>The link will expire in 10 minutes.</p>
    <p>If you didn't request a password reset, please ignore this email.</p> <br>
      ----------------------------------------<br>
     <b>UMKB</b><br>
    </div>`;
    await sendEmail(user.email, "Reset Password", text);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { token, password, password2 } = req.body;
    if (password !== password2) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const { error } = resetPasswordValidation({ password });
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      const user = await User.findById(decoded.userId);
      if (!user || user.token !== token) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      userId = decoded.userId;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(400)
          .json({ message: "Password reset link has expired" });
      }
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.token = "";
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
