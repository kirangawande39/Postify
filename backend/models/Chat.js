const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }],
      validate: {
        validator: function (v) {
          return v.length >= 2;
        },
        message: "Chat must have at least 2 members",
      },
    },
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
