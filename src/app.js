const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.post("/signup", async (req, res) => {
  //Creating a new instance for user model
  const user = new User({
    firstName: "Ankit",
    lastName: "Tiwari",
    emailId: "ankit123@gmail.com",
    password: "ankit@123",
  });

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DataBase connection established...");
    app.listen(7777, () => {
      console.log("server is listning on port 7777");
    });
  })
  .catch((err) => {
    console.error("can't connect to Data Base");
  });
