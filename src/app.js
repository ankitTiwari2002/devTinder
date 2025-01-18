const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const app = express();

require("dotenv").config();

const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("DataBase connection established...");
    app.listen(process.env.PORT, () => {
      console.log("server is listning on port 7777");
    });
  })
  .catch((err) => {
    console.error("can't connect to Data Base");
  });
