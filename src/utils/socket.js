const socket = require("socket.io");
const crypto = require("crypto");
const { log } = require("console");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializedSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    //handle events
    socket.on("joinChat", ({ userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, message }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          //save messsage to the database
          let chat = await Chat.findOne({
            participents: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({ participents: [userId, targetUserId] });
          }

          chat.messages.push({ senderId: userId, text: message });

          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, message });
        } catch (err) {
          console.log(err);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};

module.exports = initializedSocket;
