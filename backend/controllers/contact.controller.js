import mongoose from "mongoose";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const searchContacts = async (req, res) => {
    try {
        const { searchUser } = req.body
        console.log(searchUser)
        if (searchUser === undefined || searchUser === null) {
            return res.status(400).json({ error: "Contact Name Required", success: false })
        }

        const sanitizedSearchContact = searchUser.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        )
        const regex = new RegExp(sanitizedSearchContact, "i")

        const contacts = await User.find({ $and: [{ _id: { $ne: req.user._id } }, { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }] }).select("-password")

        return res.status(200).json({ contacts, success: true })

    } catch (error) {
        console.log(`Error at searchContact Controller : ${error.message}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};

export const getContactsForDMList = async (req, res) => {
    try {
        let userId = req.user._id
        userId = new mongoose.Types.ObjectId(userId)

        const contacts = await Message.aggregate([
            {
                $match:{
                    $or:[{sender:userId},{recipient:userId}]
                }
            },
            {
                $sort:{timestamp:-1}
            },
            {
                $group:{
                    _id:{
                        $cond:{
                            if:{$eq:["$sender",userId]},
                            then:"$recipient",
                            else:"$sender"
                        }
                    },
                    lastMessageTime:{$first : "$timstamp"}
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"_id",
                    foreignField:"_id",
                    as:"contactInfo"
                },
            },
            {
                $unwind:"$contactInfo"
            },
            {
                $project:{
                    _id:1,
                    lastMessageTime:1,
                    email:"$contactInfo.email",
                    firstName:"$contactInfo.firstName",
                    lastName:"$contactInfo.lastName",
                    image:"$contactInfo.image",
                    color:"$contactInfo.color",
                }
            },
            {
                $sort:{lastMessageTime:-1}
            }
        ])

        return res.status(200).json({ contacts, success: true })

    } catch (error) {
        console.log(`Error at getContactsForDMList Controller : ${error.message}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};

export const getAllContacts = async (req, res) => {
    try {
        const users = await User.find({
            _id:{
                $ne: req.user._id
            }
        }).select("firstName lastName email")

        // console.log("getAllContacts : ",users)

        const contacts = users.map((user)=>({
            label:user.firstName ? `${user.firstName} ${user.lastName}`:user.email,
            value:user._id
        }))

        return res.status(200).json({ contacts, success: true })

    } catch (error) {
        console.log(`Error at getAllContacts Controller : ${error.message}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};