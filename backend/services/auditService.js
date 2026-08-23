const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  req,
  module,
  action,
  targetId = null,
  targetType = null,
  description,
  metadata = {},
  success = true,
  actor = null,
  actorEmail = null,
}) => {
  try {
    const user = req?.user;

    const auditData = {
      actor: actor || user?.id || user?._id || null,

      actorEmail:
        actorEmail ||
        user?.email ||
        null,

      module,
      action,
      targetId,
      targetType,
      description,
      metadata,
      success,

      ipAddress:
        req?.headers?.["x-forwarded-for"]
          ?.split(",")[0]
          ?.trim() ||
        req?.ip ||
        req?.socket?.remoteAddress ||
        null,

      userAgent:
        req?.headers?.["user-agent"] || null,
    };

    return await AuditLog.create(auditData);
  } catch (error) {
    // Audit failure should NEVER break the main application request.
    console.error("AUDIT LOG ERROR:", error.message);

    return null;
  }
};

const getAuditLogs = async ({
  page = 1,
  limit = 20,
  module,
  action,
  actor,
  targetId,
  startDate,
  endDate,
}) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const filter = {};

  if (module && module !== "ALL") {
    filter.module = module.toUpperCase();
  }

  if (action && action !== "ALL") {
    filter.action = action.toUpperCase();
  }

  if (actor) {
    filter.actor = actor;
  }

  if (targetId) {
    filter.targetId = targetId;
  }

  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate("actor", "username email name")
      .populate({
        path: "targetId",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    AuditLog.countDocuments(filter),
  ]);


  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  createAuditLog,
  getAuditLogs,
};