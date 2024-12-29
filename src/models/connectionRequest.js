const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ["intrested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if from user id is same as to user id
  if (connectionRequest.fromUserId.equals(this.toUserId)) {
    throw new Error("can not send request to your self!");
  }
  next();
});

const connectionRequestModel = new mongoose.model(
  "connectionRequestModel",
  connectionRequestSchema
);
module.exports = connectionRequestModel;
