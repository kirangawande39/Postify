const commentServices = require("../services/commentService");
const { createAuditLog } = require("../services/auditService");
// Add Comment
const addComment = async (req, res, next) => {
  try {
    const result = await commentServices.addComment(req);
    await createAuditLog({
      req,
      module: "COMMENT",
      action: "CREATE",
      targetId: result._id,
      targetType: "Comment",
      description: "User created a comment",
      success: true,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Get Comments
const getComments = async (req, res, next) => {
  try {
    const result = await commentServices.getComments(req);
    // console.log("result", result)
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Delete Comment
const deleteComment = async (req, res, next) => {
  try {
    const result = await commentServices.deleteComment(req);

    await createAuditLog({
      req,
      module: "COMMENT",
      action: "DELETE",
      targetId: req.params.id,
      targetType: "Comment",
      description: "User deleted a comment",
      success: true,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { addComment, getComments, deleteComment };