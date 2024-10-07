import mongoose from "mongoose";
import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.user._id;

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).json({ error: "Admin is Must.", success: false });
        }

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res
                .status(400)
                .json({ error: "some members are not valid user.", success: false });
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId,
        });

        await newChannel.save()

        return res.status(201).json({ channel: newChannel, message: "Channel Created Successfully", success: true })
    } catch (error) {
        console.log(`Error at createChannel Controller : ${error.message}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};


export const getUserChannels = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id)
      const channels = await  Channel.find({
        $or:[{admin:userId},{members:userId}]
      }).select("-password").sort({updatedAt: -1})

    //   console.log("GEt USer Channels at channel controller : ",channels)

        return res.status(200).json({ channels, message: "Users channels are fetched.", success: true })
    } catch (error) {
        console.log(`Error at getUserChannels Controller : ${error.message}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};


export const getChanneMessages = async (req, res) => {
    try {
      const {channelId} = req.params;
      const channel = await Channel.findById(channelId).populate({
        path:"messages",
        populate:{
            path:"sender",
            select: "firstName lastName email image color"
        }
      })

      if (!channel) {
        return res.status(404).json({error:"Channel not found",success:false})
      }

      const messages = channel.messages

      return res.status(200).json({messages, success:true, message:"Fetched all messages"})

    //   console.log("GEt USer Channels at channel controller : ",channels)

        return res.status(200).json({ channels, message: "Users channels are fetched.", success: true })
    } catch (error) {
        console.log(`Error at getUserChannels Controller : ${error.message}`);
        res.status(500).json({ error: "Internal Server Error", success: false });
    }
};
