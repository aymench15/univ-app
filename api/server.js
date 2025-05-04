import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import contactRoute from "./routes/contact.route.js";
import authRoute from "./routes/auth.route.js";
import adminRoute from "./routes/admin.route.js";
import http from "http";
import { Server as socketIo } from "socket.io";
import cors from "cors";
import cookieSession from "cookie-session"; // Import cookie-session
import cookieParser from "cookie-parser";
import { env } from "process";
// import Admin from "./models/admin.model.js";
// import bcrypt from "bcrypt";
const app = express();
dotenv.config();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      // "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(
  cookieSession({
    name: "session",
    keys: ["accessToken", "accessTokenAdmin"], 
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: false, 
  })
);

mongoose.set("strictQuery", true);

const connect = async () => {
  console.log("Connecting to db...");
  await mongoose.connect(env.MONGO);
  console.log("Connected to mongoDB!");
  // const saltRounds = 10; // Define the number of salt rounds

  // const hashedPassword = await bcrypt.hash("vrb2025", saltRounds); // Hash the password

  // const newAdmin = new Admin({
  //   name: "ViceRectorBiskra",
  //   password: hashedPassword, // Use the hashed password
  // }); // Correct syntax
  // await newAdmin.save();
};

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/contact", contactRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).send(errorMessage);
});

const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  },
});
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("setUser", ({ userId, userName }) => {
    connectedUsers.set(socket.id, { userId, userName });
  });

  socket.on("joinConversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`User ${socket.id} joined conversation ${conversationId}`);
  });

  socket.on("sendMessage", (messageData) => {
    const { message, conversationId, userId } = messageData;
    console.log("Message received: ", messageData);

    io.to(conversationId).emit("message", message);
    console.log(`Message broadcasted to conversation ${conversationId}`);

    const sender = Array.from(connectedUsers.values()).find(
      (user) => user.userId === userId
    );
    const senderName = sender ? sender.userName : "Unknown User";

    socket.to(conversationId).emit("notification", {
      message: message.desc,
      senderName: senderName,
      data: message,
      userName: message.userName,
    });
    console.log(`Notification sent to conversation ${conversationId}`);
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8800;

server.listen(PORT, async () => {
  console.log(`Backend server is running on port ${PORT}!`);
  try {
    await connect();
  } catch (err) {
    console.error(err);
    console.error("Server crashed :(");
    process.exit(1);
  }
});
