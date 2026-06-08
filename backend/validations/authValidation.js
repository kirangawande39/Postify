const joi = require('joi')

const registerSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    username:joi.string().min(3).max(20).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required()
})

const emailSchema=joi.object({
    email:joi.string().email().required()
})


const resetPasswordSchema = joi.object({
  token: joi.string()
    .required(),

  newPassword: joi.string()
    .min(8)
    .max(30)
    .required(),
});


const verifyOTPSchema=joi.object({
    email:joi.string().email().required(),
    otp:joi.string().min(6).max(6).required()
})


module.exports = { registerSchema, loginSchema ,emailSchema, resetPasswordSchema,verifyOTPSchema }