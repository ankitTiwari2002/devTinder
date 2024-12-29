const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

express = require("express");

const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName gender age photourl skills about";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    //fetching the data which is pending for reciver
    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUserId,
        status: "intrested",
      })
      .populate("fromUserId", USER_SAFE_DATA);
    // .populate("fromUserId", ["firstName", "lastName"]);

    res.json({ message: "requested people", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connectionRequest = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUserId, status: "accepted" },
          { fromUserId: loggedInUserId, status: "accepted" },
        ],
      })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "your connections are ", data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //User should see all the user card accept
    //0. his own card
    //1. his connections
    //2. ignored people
    //3. already sent connection request
    const loggedInUserId = req.user._id;
    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
      })
      .select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUserId } },
      ],
    }).select(USER_SAFE_DATA);
    res.send(users);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
module.exports = userRouter;
