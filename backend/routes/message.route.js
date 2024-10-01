import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { getMessage, uploadFile } from "../controllers/message.controller.js";
import upload from "../middlewares/multer.js";

const messageRoutes = Router()

messageRoutes.post("/get-message", protectedRoute, getMessage)
messageRoutes.post("/upload-file", protectedRoute , upload.single("file"), uploadFile)

export default messageRoutes