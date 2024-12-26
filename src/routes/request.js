const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");

//send connection request
requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("sending a connction request");

  res.send(user.firstName + " sent the connction request");
});

module.exports = requestRouter;
