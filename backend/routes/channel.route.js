import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { createChannel, getChanneMessages, getUserChannels } from "../controllers/channel.controller.js";
const channelRouter = express.Router();

channelRouter.post("/create-channel",protectedRoute,createChannel)
channelRouter.get("/get-user-channels",protectedRoute,getUserChannels)
channelRouter.get("/get-channel-messages/:channelId",protectedRoute,getChanneMessages)


export default channelRouter
