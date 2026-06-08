const joi = require('joi')

const updateUserProfileSchema = joi.object({
    name: joi.string().min(3).max(30),

    bio: joi.string().max(150).allow("", null),
});

const saveFcmTokenSchema = joi.object({
  token: joi.string().required(),
});

const updatePrivacySchema = joi.object({
  isPrivate: joi.boolean().required(),
});

module.exports = {
    updateUserProfileSchema,
    saveFcmTokenSchema,
    updatePrivacySchema
};