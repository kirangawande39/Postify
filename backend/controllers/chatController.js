const chatServices = require("../services/chatService");
const mongoose = require('mongoose')

const Chat = require('../models/Chat')
const Message = require("../models/Message")

// Create Chat
const createChat = async (req, res, next) => {
  try {
    const result = await chatServices.createChat(req);

    await createAuditLog({
      req,
      module: "CHAT",
      action: "CREATE",
      targetId: result.data?._id,
      targetType: "Chat",
      description: "User created a chat",
      success: true,
    });

    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};


const getSidebarChats = async (req, res) => {
  // console.log("getsidebar called")
  try {
    const userId = req.user?.id;

    const chats = await Chat.find({
      members: userId,
    })
      .populate("members", "username profilePic lastSeen")
      .sort({ updatedAt: -1 });

    // console.log(chats)

    const chatIds = chats.map(chat => chat?._id);
    // console.log("chatIds:", chatIds)

    const unreadCounts = await Message.aggregate([
      {
        $match: {
          chatId: { $in: chatIds },
          sender: { $ne: new mongoose.Types.ObjectId(userId) },
          seen: false,
        },
      },
      {
        $group: {
          _id: "$chatId",
          count: { $sum: 1 },
        },
      },
    ]);

    const unreadMap = {};

    unreadCounts.forEach(item => {
      unreadMap[item._id.toString()] = item.count;
    });

    // console.log("unreadcount:", unreadCounts)
    // const msg=await Message.find()

    const sidebarData = chats
      .map(chat => {
        const otherUser = chat.members.find(
          member => member._id.toString() !== userId.toString()
        );

        if (!otherUser) {
          // console.log("Invalid chat:", chat._id);
          return null;
        }

        return {
          _id: otherUser._id,
          username: otherUser.username,
          profilePic: otherUser.profilePic,
          lastSeen: otherUser.lastSeen,
          lastMessage: chat.lastMessage,
          unreadCount: unreadMap[chat._id.toString()] || 0,
        };
      })
      .filter(Boolean);

    // console.log("sidebardata:", sidebarData)

    res.status(200).json(sidebarData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createChat, getSidebarChats };