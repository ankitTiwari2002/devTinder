const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");

express = require("express");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user;

    //fetching the data which is pending for reciver
    const connectionRequest = await connectionRequestModel
      .find({
        toUserId: loggedInUserId,
        status: "intrested",
      })
      .populate(
        "fromUserId",
        "firstName lastName gender age photourl skills about"
      );
    // .populate("fromUserId", ["firstName", "lastName"]);

    res.json({ message: "requested people", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
