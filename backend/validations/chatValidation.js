const joi = require('joi')

const chatSchema = joi.object({
    members: joi.array()
        .items(joi.string())
        .min(2)
        .required()
})


const sendMessageSchema = joi.object({
  chatId: joi.string()
    .required(),

  receiverId: joi.string()
    .required(),

  text: joi.string()
    .trim()
    .min(1)
    .max(1000)
    .required(),
});




module.exports={chatSchema , sendMessageSchema}