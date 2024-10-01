import express from "express"
import { login, logout, signup, updateProfile, updateProfileImage, updateProfileImage_remove } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import upload from "../middlewares/multer.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/updateProfile", protectedRoute, updateProfile);
authRouter.post("/updateProfileImage", protectedRoute, upload.single("profile-image"), updateProfileImage);
authRouter.post("/updateProfileImage_remove", protectedRoute, updateProfileImage_remove);
// authRouter.post("/updateProfileImage_remove", protectedRoute, upload.single("profile-image"), updateProfileImage_remove);

export default authRouter;