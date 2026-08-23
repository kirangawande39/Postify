const {
  getAuditLogs: fetchAuditLogs,
} = require("../services/auditService");

const getAuditLogs = async (req, res, next) => {
  try {
    if (req.user.id.toString() !== process.env.OWNER_Id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view audit logs",
      });
    }

    const result = await fetchAuditLogs({
      page: req.query.page,
      limit: req.query.limit,

      module: req.query.module,
      action: req.query.action,

      actor: req.query.actor,
      targetId: req.query.targetId,

      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs,
};