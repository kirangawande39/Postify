const express = require("express");
const { createChat, getSidebarChats } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");
const validate= require("../middlewares/validate");

const {chatSchema}= require('../validations/chatValidation')


const router = express.Router();


router.get("/sidebar", protect , getSidebarChats)
router.post("/" , protect,  createChat); // Start a new chat
module.exports = router;
