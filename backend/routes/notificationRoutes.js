const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/",  getNotifications); 
router.put("/:id/read", markAsRead);

module.exports = router;
