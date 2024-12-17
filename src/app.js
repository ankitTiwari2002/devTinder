const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  //request handler
  res.send("its test page");
});

app.use("/hello", (req, res) => {
  //request handler
  res.send("hello hello hello! its hello page");
});

app.use("/", (req, res) => {
  //request handler
  res.send("server is here...");
});

app.listen(777, () => {
  console.log("server is listning on port 777");
});
