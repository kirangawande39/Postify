const express = require("express");
const { createChat, getUserChats, getSidebarChats } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware");
const validate= require("../middlewares/validate");

const {chatSchema}= require('../validations/chatValidation')


const router = express.Router();

router.post("/" , protect,  createChat); // Start a new chat
router.get("/sidebar", protect , getSidebarChats)
router.get("/:userId", protect, getUserChats); // Get user chats
module.exports = router;
