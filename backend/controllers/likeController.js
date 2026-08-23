const likeServices = require("../services/likeService");
const { createAuditLog } = require("../services/auditService");
// like post
const likePost = async (req, res, next) => {
  try {
    const result = await likeServices.likePost(req);

    await createAuditLog({
      req,
      module: "LIKE",
      action: "CREATE",
      targetId: result._id,
      targetType: "Like",
      description: "User liked a post",
      success: true,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// unlike post
const unlikePost = async (req, res, next) => {
  try {
    const result = await likeServices.unlikePost(req);

    await createAuditLog({
      req,
      module: "LIKE",
      action: "DELETE",
      targetId: req.params.id,
      targetType: "Like",
      description: "User removed a post like",
      success: true,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { likePost, unlikePost };