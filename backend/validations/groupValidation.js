const joi = require("joi");

const createGroupSchema = joi.object({
  name: joi.string()
    .min(3)
    .max(50)
    .required(),

  description: joi.string()
    .max(500)
    .allow("", null),

  privacy: joi.string()
    .valid("public", "private")
    .required(),
});


const sendGroupMessageSchema = joi.object({
  message: joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required(),

  groupId: joi.string()
    .length(24)
    .hex()
    .required(),
});

const addGroupMembersSchema = joi.object({
  groupId: joi.string()
    .length(24)
    .hex()
    .required(),

  members: joi.array()
    .items(
      joi.string()
        .length(24)
        .hex()
    )
    .min(1)
    .required(),
});

module.exports = {
  createGroupSchema,
  sendGroupMessageSchema,
  addGroupMembersSchema
};