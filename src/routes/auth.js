const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

//signUp API
authRouter.post("/signup", async (req, res) => {
  try {
    //first validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //then encryot password
    const passwordHash = await bcrypt.hash(password, 10);
    //Creating a new instance for user model and store it in a database
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();

      //add the token to cookie and send the response back to user
      res.cookie("token", token);
      res.send("user login successfully!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error to login the user: " + err.message);
  }
});

//logout API
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("user logout successfully!");
});

module.exports = authRouter;
