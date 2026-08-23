const messageServices = require("../services/messageService");
const { createAuditLog } = require("../services/auditService");
// send message
const sendMessage = async (req, res, next) => {
  try {
    const result = await messageServices.sendMessage(req);

    await createAuditLog({
      req,
      module: "MESSAGE",
      action: "SEND",
      targetId: result._id,
      targetType: "Message",
      description: "User sent a message",
      success: true,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// get messages
const getMessages = async (req, res, next) => {
  try {
    const { messages, hasMore } = await messageServices.getMessages(req);

    res.status(200).json({
      messages,
      hasMore
    });

  } catch (err) {
    next(err);
  }
};

// seen messages
const seenMessages = async (req, res, next) => {
  try {
    const result = await messageServices.seenMessages(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// delete message
const deleteMessage = async (req, res, next) => {
  try {
    const result = await messageServices.deleteMessage(req);
    await createAuditLog({
  req,
  module: "MESSAGE",
  action: "DELETE",
  targetId: req.params.msgId,
  targetType: "Message",
  description: "User deleted a message",
  success: true,
});
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// send image
const sendImage = async (req, res, next) => {
  try {
    const result = await messageServices.sendImage(req);
    await createAuditLog({
  req,
  module: "MESSAGE",
  action: "SEND",
  targetId: result._id,
  targetType: "Message",
  description: "User sent an image message",
  success: true,
});
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// unseen count
const getUnseenMessageCounts = async (req, res, next) => {
  try {
    const result = await messageServices.getUnseenMessageCounts(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  seenMessages,
  deleteMessage,
  sendImage,
  getUnseenMessageCounts
};