const User = require("../models/User");

const onlineUsers = new Map();
const lastSeen = new Map();

const userSocket = (io, socket) => {

  socket.on("user-online", async (userId) => {

    await User.findByIdAndUpdate(userId, {
      lastSeen: null
    });

    onlineUsers.set(userId, socket.id);

    io.emit(
      "online-users",
      Array.from(onlineUsers.keys())
    );

  });


  
  socket.on("disconnect", async () => {

    for (let [userId, socketId] of onlineUsers) {

      if (socketId === socket.id) {

        onlineUsers.delete(userId);

        await User.findByIdAndUpdate(userId, {
          lastSeen: new Date()
        });

        io.emit(
          "online-users",
          Array.from(onlineUsers.keys())
        );

        break;
      }
    }

  });

};




module.exports = { onlineUsers, lastSeen, userSocket };
