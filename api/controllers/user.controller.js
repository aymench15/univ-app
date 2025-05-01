import { User } from "../models/user.model.js";
import createError from "../utils/createError.js";
import bcrypt from "bcrypt";
import multer from "multer";
import Grid from "gridfs-stream";
import path from "path";
import { Token } from "../models/token.js";
import {resetPasswordValidation} from '../models/user.model.js'
import {
  uploadFile,isSupportedFileType,
} from "../utils/cloudinaryUpload.js";
import formidable from "formidable";
import Document from "../models/document.model.js";
import { sendEmail } from "../utils/sendEmail.js";

export const deleteUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (req.userId !== user._id.toString()) {
    return next(createError(403, "You can delete only your account!"));
  }
  await User.findByIdAndDelete(req.params.id);
  res.status(200).send("deleted.");
};

export const getUser = async (req, res) => {
  try {
    if (!req.body.id)
      return res.status(404).send({ message: "User not found" });
    const user = await User.findById(req.body.id);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    console.log("User found: ", user.appointments);
    res.status(200).send(user);
  } catch (error) {
    console.error("Error getting user with appointments:", error);
    res
      .status(500)
      .send({ message: "An error occurred while retrieving the user." });
  }
};

export const userUpdate = async (req, res) => {
  console.log("update user !", req.body);
  try {
    const { password, ...otherUpdates } = req.body;
    const { error } = resetPasswordValidation({ password });

    if (error) {
          console.log(error.details[0].message)
      return res.status(401).json({ message: error.details[0].message });
    }
    let updatedUser;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedUser = await User.findByIdAndUpdate(
        req.query.id,
        { ...otherUpdates, password: hashedPassword },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(req.query.id, otherUpdates, {
        new: true,
      });
    }

    updatedUser = await updatedUser.save();
    return res.status(200).send({
      user: updatedUser,
      message: "Informations updated successfully !",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};
export const doctorUpdate = async (req, res) => {
  try {
    const { password, ...otherUpdates } = req.body;
    let updatedDoctor;
    Object.keys(otherUpdates).forEach((key) => {
      console.log(key, otherUpdates[key]);
      if (otherUpdates[key] === "undefined") {
        console.log(otherUpdates[key]);
        otherUpdates[key] = "";
        console.log(otherUpdates[key]);
      } else if (Array.isArray(otherUpdates[key])) {
        otherUpdates[key] = JSON.stringify(otherUpdates[key]);
      } else if (
        typeof otherUpdates[key] === "string" &&
        otherUpdates[key].startsWith("[")
      ) {
        otherUpdates[key] = JSON.parse(otherUpdates[key]);
      }
    });

    console.log("req.body : ", req.user);
    console.log("req.query.file : ", req.file);
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedDoctor = await Doctor.findByIdAndUpdate(
        req.query.id,
        { ...otherUpdates, password: hashedPassword },
        { new: true }
      );
    } else {
      updatedDoctor = await Doctor.findByIdAndUpdate(
        req.query.id,
        otherUpdates,
        {
          new: true,
        }
      );
    }
    let photoUrl = null;
    let urlphoto = null;
    await updatedDoctor.save();
    if (req.file) {
      console.log("req.file : ", req.file);
      const result = await uploadImageToCloudinary(req.file);
      photoUrl = result.url;

      console.log("photoUrl : ", photoUrl);
      if (!photoUrl.startsWith("https")) {
        urlphoto = photoUrl.replace("http", "https");
      } else {
        urlphoto = photoUrl;
      }
      console.log("url new ", urlphoto);
      await User.findByIdAndUpdate(
        updatedDoctor.userId,
        { img: urlphoto },
        { new: true }
      );
    }

    res.status(200).send({
      updatedInfo: updatedDoctor,
      message: "Informations updated successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while updating the user" });
  }
};

export const checkoutSession = (req, res) => {
  console.log("checkout session");
  res.status(200).send([]);
};

export const verifyEmailUsers = async (req, res) => {
  try {
    console.log("from verifyEmailUsers ", req.params.id, req.params.token);
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });
    console.log(token);
    await User.findByIdAndUpdate(
      { _id: req.params.id },
      { verified: true },
      { new: true }
    );

    await token.deleteOne();

    res
      .status(200)
      .redirect(
        `${process.env.BASE_URL}success?message=Registration Successful&isPayment=false`
      );
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// export const uploadDocuments = async (req, res, next) => {
//   console.log("UploadDocuments");
//   try {
//     console.log("id : ", req.user);
//     const { file } = req;

//     if (!file || file.mimetype !== "application/pdf") {
//       return res
//         .status(400)
//         .json({ error: "Invalid file type. Only PDFs allowed." });
//     }

//     // Upload to Cloudinary
//     const result = await uploadPdfToCloudinary(file.buffer);

//     // Save document metadata to the database
//     const newDocument = new Document({
//       userId: req.user.id,
//       name: file.originalname,
//       size: file.size,
//       cloudinaryUrl: result.secure_url,
//       note: req.body.note || "",
//     });

//     await newDocument.save();
//     const user = await User.findById(req.user.id);
//     const emailContent = `
//     <div style="text-align: center;">
//       <img src="https://res.cloudinary.com/diawojtfk/image/upload/v1736643192/fxkpbqlqrmu6ay58sp6v.png" alt="UMKB Logo" style="width: 100px; height: auto;"><br><br>
//       Dear ${user.name},<br>
//       Thank you for successfully uploading your file.<br><br>
//       ----------------<br>
//       <b>UMKB</b><br>
//     </div>`;
//     await sendEmail(user.email, "File uploaded succefully", emailContent);
//     res.status(200).json({ message: "Document uploaded successfully" });
//   } catch (error) {
//     console.error("Error uploading document:", error);
//     res
//       .status(500)
//       .json({ error: "Failed to upload document", details: error.message });
//   }
// };

// export const uploadDocuments = async (req, res, next) => {
//   console.log("UploadDocuments");
//   try {
//     console.log("user id:", req.user);
//     const { file } = req;

//     // Check if file exists
//     if (!file) {
//       return res.status(400).json({ error: "No file uploaded." });
//     }

//     // Validate file type
//     const supportedTypes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//     ];

//     if (!supportedTypes.includes(file.mimetype)) {
//       return res.status(400).json({
//         error: "Invalid file type. Only PDF and Word documents are allowed."
//       });
//     }

//     // Upload to Cloudinary
//     const uploadResult = await uploadFile(file);

//     // Save document metadata to database
//     const newDocument = new Document({
//       userId: req.user.id,
//       name: file.originalname,
//       size: file.size,
//       cloudinaryUrl: uploadResult.secure_url,
//       cloudinaryPublicId: uploadResult.public_id,
//       fileType: uploadResult.fileType || file.mimetype,
//       note: req.body.note || "",
//       uploadDate: new Date()
//     });

//     await newDocument.save();

//     // Fetch user for email notification
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Generate user-friendly file type text
//     const fileTypeMap = {
//       'application/pdf': 'PDF',
//       'application/msword': 'Word Document',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document'
//     };

//     const fileTypeText = fileTypeMap[file.mimetype] || 'Document';

//     // Create email content
//     const emailContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//       <div style="text-align: center;">
//         <img src="https://res.cloudinary.com/diawojtfk/image/upload/v1736643192/fxkpbqlqrmu6ay58sp6v.png" 
//              alt="UMKB Logo" 
//              style="width: 100px; height: auto;">
//       </div>
      
//       <div style="margin-top: 20px; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
//         <h2 style="color: #333; margin-bottom: 20px;">Document Upload Successful</h2>
        
//         <p>Dear ${user.name},</p>
        
//         <p>Your document has been successfully uploaded to our system.</p>
        
//         <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-radius: 5px;">
//           <p style="margin: 5px 0;"><strong>File Name:</strong> ${file.originalname}</p>
//           <p style="margin: 5px 0;"><strong>File Type:</strong> ${fileTypeText}</p>
//           <p style="margin: 5px 0;"><strong>File Size:</strong> ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
//           ${req.body.note ? `<p style="margin: 5px 0;"><strong>Note:</strong> ${req.body.note}</p>` : ''}
//         </div>

//         <p style="color: #666; font-size: 0.9em;">If you did not upload this document, please contact our support team immediately.</p>
//       </div>
      
//       <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
//         <p style="color: #666;">Best regards,<br><strong>UMKB Team</strong></p>
//       </div>
//     </div>`;

//     // Send email notification
//     try {
//       await sendEmail(
//         user.email,
//         "Document Upload Confirmation",
//         emailContent
//       );
//     } catch (emailError) {
//       console.error("Error sending email notification:", emailError);
//       // Continue execution even if email fails
//     }

//     // Send success response
//     res.status(200).json({
//       message: "Document uploaded successfully",
//       document: {
//         id: newDocument._id,
//         name: newDocument.name,
//         type: newDocument.fileType,
//         url: newDocument.cloudinaryUrl
//       }
//     });

//   } catch (error) {
//     console.error("Error uploading document:", error);
//     res.status(500).json({
//       error: "Failed to upload document",
//       details: error.message
//     });
//   }
// };


export const uploadDocuments = async (req, res, next) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Validate file type using the imported utility
    if (!isSupportedFileType(file.mimetype)) {
      return res.status(400).json({
        error: "Invalid file type. Only PDF, Word documents, and images are allowed."
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadFile(file);

    // Save document metadata to database
    const newDocument = new Document({
      userId: req.user.id,
      name: file.originalname,
      size: file.size,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      fileType: uploadResult.fileType || file.mimetype,
      note: req.body.note || "",
      uploadDate: new Date()
    });

    await newDocument.save();
    const user = await User.findById(req.user.id);
     // Create email content
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center;">
        <img src="https://res.cloudinary.com/diawojtfk/image/upload/v1736643192/fxkpbqlqrmu6ay58sp6v.png" 
             alt="UMKB Logo" 
             style="width: 100px; height: auto;">
      </div>
      
      <div style="margin-top: 20px; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
        <h2 style="color: #333; margin-bottom: 20px;">Document Upload Successful</h2>
        
        <p>Dear ${user.name},</p>
        
        <p>Your document has been successfully uploaded to our system.</p>
        
        <div style="margin: 20px 0; padding: 15px; background-color: #fff; border-radius: 5px;">
          <p style="margin: 5px 0;"><strong>File Name:</strong> ${file.originalname}</p>
          <p style="margin: 5px 0;"><strong>File Size:</strong> ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          ${req.body.note ? `<p style="margin: 5px 0;"><strong>Note:</strong> ${req.body.note}</p>` : ''}
        </div>

        <p style="color: #666; font-size: 0.9em;">If you did not upload this document, please contact our support team immediately.</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666;">Best regards,<br><strong>UMKB Team</strong></p>
      </div>
    </div>`;

    // Send email notification
    try {
      await sendEmail(
        user.email,
        "Document Upload Confirmation",
        emailContent
      );
    } catch (emailError) {
      console.error("Error sending email notification:", emailError);
      // Continue execution even if email fails
    }
   

    res.status(200).json({
      message: "Document uploaded successfully",
      document: {
        id: newDocument._id,
        name: newDocument.name,
        type: newDocument.fileType,
        url: newDocument.cloudinaryUrl
      }
    });

  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({
      error: "Failed to upload document",
      details: error.message
    });
  }
};