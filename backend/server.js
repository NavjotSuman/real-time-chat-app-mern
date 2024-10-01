import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./db/connectMongoDB.js";
import authRoutes from "./routes/auth.route.js";
import { v2 as cloudinary } from "cloudinary";
import contactRoutes from "./routes/contact.route.js";
import setupSocket from "./socket/socket.js";
import { createServer } from "node:http"
import messageRoutes from "./routes/message.route.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});


const app = express()
const server = createServer(app)
const port = process.env.PORT || 4001;

app.use(cors({ origin: [process.env.ORIGIN], credentials: true }));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messageRoutes);


server.listen(port, () => {
  connectMongoDB();
  setupSocket(server)
  console.log(`server runnig at port ${port}`);
})