const mongoose = require("mongoose");
//mongodb+srv://ankittiwari6705:<db_password>@namastenode.k69xq.mongodb.net/
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ankittiwari6705:K5v7CxrmhaOaSLQ8@namastenode.k69xq.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
