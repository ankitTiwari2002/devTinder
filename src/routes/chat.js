const express = require("express");
const { userAuth } = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { targetUserId } = req.params;
    let chat = await Chat.find({
      participents: { $all: [userId, targetUserId] },
    }).populate({ path: "messages.senderId", select: "firstName lastName" });

    if (!chat) {
      chat = new Chat({ participents: [userId, targetUserId], messages: [] });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.log(err);
  }
});
module.exports = chatRouter;
