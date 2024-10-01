import Message from "../models/message.model.js";
import fs from "fs"
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";

export const getMessage = async (req, res) => {
    try {
        const user1 = req.user._id;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return res
                .status(400)
                .json({ error: "User must me Provided.", success: false });
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 },
            ],
        }).sort({ timestamp: 1 }).select("-password");

        return res.status(200).json({ messages, success: true });
    } catch (error) {
        console.log(`Error at getMessage Controller : ${error.message}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};


export const uploadFile = async (req, res) => {
    try {
        const userId = req.user._id
        if (!req.file) {
            return res.status(400).json({ error: "File is Required", success: false })
        }
        // console.log("req.file : ", req.file)
        const fileName = req.file.originalname
        // console.log("Original Name : ",fileName)

        const cloudinary_res = await cloudinary.uploader.upload(req.file.path, { resource_type: "raw" })
        fs.unlink(req.file.path, (err) => {
            console.log("Error at unlink multer upload file", err)
        })
        // console.log(cloudinary_res)

        return res.status(200).json({ filePath: cloudinary_res.secure_url, fileName, message: "File uploaded Successfully.", success: true });
    } catch (error) {
        console.log(`Error at uploadFile Controller : ${error}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};


