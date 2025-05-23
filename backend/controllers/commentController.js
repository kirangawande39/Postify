const Comment = require("../models/Comment");
const Post = require("../models/Post");

// Add a Comment
const addComment = async (req, res) => {
  try {
    console.log("Comment route is here");

    const comment = await Comment.create({
      user: req.user.id,
      post: req.params.postId,
      text: req.body.newComment,
    });

    // Add comment ID to the post's comments array
    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: comment._id },
    });

    // Respond with the created comment
    res.status(201).json(comment);

  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Get Comments
const getComments = async (req, res) => {

    console.log("All comments is here"+req.params.postId)
    const comments = await Comment.find({ post: req.params.postId }).populate("user");
    
    // console.log("Comments:"+comments)

    res.json({comments});
};

// Delete Comment
const deleteComment = async (req, res) => {
  console.log("Delete comment logic here");
  console.log("CommentId:"+req.params.commentId)
   const commentId = req.params.commentId;

  try{

    // Find the comment to get the postId
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const postId = comment.post; // Assuming comment has a post field

    const comments = await Comment.findByIdAndDelete(commentId);

    console.log("deleted comment:"+comments)

    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId }
    });
    res.status(200).json({ message: "Comment deleted and removed from post" });

  }
  catch (error) {
    console.error("Error delete comment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }




};

module.exports = { addComment, getComments, deleteComment };
