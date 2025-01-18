import { sendEmail } from "../utils/sendEmail.js";
import dotenv from "dotenv";
dotenv.config();

export const sendContactMessage = async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    console.log(req.body);
    const emailContent = `
      <div>
        <img src="https://res.cloudinary.com/diawojtfk/image/upload/v1736643192/fxkpbqlqrmu6ay58sp6v.png" alt="UMKB Logo" style="width: 100px; height: auto;"><br><br>
        <b>Email:</b> ${email}<br>
        <b>Subject:</b> ${subject}<br>
        <b>Message:</b> ${message}<br>
      </div>
    `;

    sendEmail(
      process.env.EMAIL_USER,
      "New contact email with subject:  " + subject,
      emailContent
    );

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
};
