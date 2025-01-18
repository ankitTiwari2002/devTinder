const mongoose = require("mongoose");
//mongodb+srv://ankittiwari6705:<db_password>@namastenode.k69xq.mongodb.net/
const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};

module.exports = connectDB;
