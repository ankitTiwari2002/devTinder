const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.send("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      //create a jwt token
      const token = await jwt.sign({ _id: user._id }, "Ankit@123");

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

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decoddedMessage = await jwt.verify(token, "Ankit@123");
    const { _id } = decoddedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// get user from the database
app.get("/user", async (req, res) => {
  try {
    const user = await User.find({ emailId: req.body.emailId });
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//feed api to get all user from the database
app.get("/feed", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

// delete user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted succesfully");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//update user in database
app.patch("/user/:userId", async (req, res) => {
  const _id = req.params?.userId;
  if (!_id) {
    return res.status(400).send("User ID is required");
  }
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).send("No data provided for update");
  }

  const updateAllowed = ["age", "gender", "photourl", "skills"];
  const isUpdateAllowed = Object.keys(data).every((k) =>
    updateAllowed.includes(k)
  );

  try {
    if (!isUpdateAllowed) {
      throw new Error("update not possible");
    }
    const user = await User.findByIdAndUpdate(_id, data, {
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("user not exist");
    } else {
      res.send("user updated succesfully");
    }
  } catch (err) {
    res.status(400).send("UPDATE FAILED: " + err.message);
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
