const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const connectionRequestModal = require("../models/connectionRequest.js");
const User = require("../models/user.js");

//send connection request
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["intrested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: `invalid status type ${status}` });
      }

      //if user not exist in db and making request with random id
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res
          .status(404)
          .json({ message: "can't connect to user becouse user not found" });
      }

      //if making request to self
      // if (toUser._id == toUserId) {
      //   res.status(400).json({ message: "can't connect our self" });
      // }

      //1. if user is requested then again requesting
      //2. if from user requesting and to user already request to from user
      const existingConnectionRequest = await connectionRequestModal.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        res.status(400).json({ message: "connection request already exist" });
      }

      const connectionRequest = new connectionRequestModal({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message: status,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

module.exports = requestRouter;
