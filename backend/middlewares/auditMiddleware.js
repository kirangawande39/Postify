const { createAuditLog } = require("../services/auditService");

const audit = ({
  module,
  action,
  targetType = null,
  getTargetId = null,
  description,
  getMetadata = null,
}) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        let targetId = null;
        let metadata = {};

        if (getTargetId) {
          try {
            targetId = getTargetId(req, body);
          } catch (error) {
            targetId = null;
          }
        }

        if (getMetadata) {
          try {
            metadata = getMetadata(req, body);
          } catch (error) {
            metadata = {};
          }
        }

        await createAuditLog({
          req,
          module,
          action,
          targetId,
          targetType,
          description:
            typeof description === "function"
              ? description(req, body)
              : description,
          metadata,
        });
      }

      return originalJson(body);
    };

    next();
  };
};

module.exports = audit;