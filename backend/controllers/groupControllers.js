const groupServices = require("../services/groupService");
const { createAuditLog } = require("../services/auditService");
const cretaeNewGroup = async (req, res, next) => {
  try {
    const result = await groupServices.cretaeNewGroup(req);
    await createAuditLog({
      req,
      module: "GROUP",
      action: "CREATE",
      targetId: result._id,
      targetType: "Group",
      description: "User created a group",
      success: true,
    });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getGroups = async (req, res, next) => {
  try {
    const result = await groupServices.getGroups(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const sendGroupMessage = async (req, res, next) => {
  // console.log("sendGroupMessage controller called:" )
  try {
    const result = await groupServices.sendGroupMessage(req);
    // console.log("Result:",result);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const getGroupsMessage = async (req, res, next) => {
  try {
    const result = await groupServices.getGroupsMessage(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const addGropuMembers = async (req, res, next) => {
  try {
    const result = await groupServices.addGropuMembers(req);
 
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteGroupByCreator = async (req, res, next) => {
  try {
    const result = await groupServices.deleteGroupByCreator(req);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  cretaeNewGroup,
  getGroups,
  sendGroupMessage,
  getGroupsMessage,
  addGropuMembers,
  deleteGroupByCreator
};