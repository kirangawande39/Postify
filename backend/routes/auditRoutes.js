const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { getAuditLogs } = require("../controllers/auditController");

router.get("/", protect, getAuditLogs);

module.exports = router;