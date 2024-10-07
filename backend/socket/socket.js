import { Server } from "socket.io"

import Message from "../models/message.model.js"
import Channel from "../models/channel.model.js"



// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         credentials: true
//     }
// })

const setupSocket = (server) => {

    const io = new Server(server, { cors: { origin: process.env.ORIGIN, methods: ['GET', 'POST'], credentials: true } })
    const userSocketMap = new Map()

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`)
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId)
                break;
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)
        console.log("recipientSocketId : ",recipientSocketId)
        console.log("senderSocketId : ",senderSocketId)

        const createdMessage = await Message.create(message)

        const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color").populate("recipient", "id email firstName lastName image color")

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData)
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData)
            
        }
    }

    // sendChannelMessage
    const sendChannelMessage = async (message) => {
        console.log("recievinf Message At Server : ", message)
        const { channelId, sender, content, messageType,fileName, fileUrl } = message

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            fileName,
            fileUrl
        })

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .exec()

        console.log("Message Data : ", messageData)

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createdMessage._id }
        })

        const channel = await Channel.findById(channelId).populate("members")

        // console.log("channel : ", channel , channelId)

        const finalData = { ...messageData._doc, channelId: channel._id }

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString())

                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieveChannelMessage", finalData)
                }

            })
            console.log("Channel Admin : ", channel.admin._id)
            const adminSocketId = userSocketMap.get(channel.admin._id.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieveChannelMessage", finalData)
            }
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId
        if (userId) {
            userSocketMap.set(userId, socket.id)
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`)
        }
        else {
            console.log(`User ID not provided during connection.`)
        }

        socket.on("sendMessage", sendMessage)
        socket.on("sendChannelMessage", sendChannelMessage)
        socket.on("disconnect", () => disconnect(socket))
    })
}

export default setupSocket
