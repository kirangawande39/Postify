const followServices = require("../services/followService");
const { createAuditLog } = require("../services/auditService");

const followUser = async (req, res, next) => {
  try {
    const result = await followServices.followUser(req);
    await createAuditLog({
      req,
      module: "FOLLOW",
      action: "FOLLOW",
      targetId: req.params.targetUserId,
      targetType: "User",
      description: "User followed another user",
      success: true,
    });
    res.status(result.status).json(result.data);
  } catch (err) {
    next(err);
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    const result = await followServices.unfollowUser(req);
    await createAuditLog({
      req,
      module: "FOLLOW",
      action: "UNFOLLOW",
      targetId: req.params.targetUserId,
      targetType: "User",
      description: "User unfollowed another user",
      success: true,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const removeFollower = async (req, res, next) => {
  try {
    const result = await followServices.removeFollower(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const declineUser = async (req, res, next) => {
  try {
    const result = await followServices.declineUser(req);
    await createAuditLog({
      req,
      module: "FOLLOW_REQUEST",
      action: "REJECTED",
      targetId: req.params.targetUserId,
      targetType: "User",
      description: "Follow request rejected",
      success: true,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const acceptUser = async (req, res, next) => {
  try {
    const result = await followServices.acceptUser(req);
    await createAuditLog({
      req,
      module: "FOLLOW_REQUEST",
      action: "ACCEPTED",
      targetId: req.params.targetUserId,
      targetType: "User",
      description: "Follow request accepted",
      success: true,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const followBack = async (req, res, next) => {
  try {
    const result = await followServices.followBack(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  removeFollower,
  declineUser,
  acceptUser,
  followBack,
};