const { createPostService, getAllPostsService, getPostByIdService, getPostsByUserIdService, deletePostService } = require("../services/postService");

const { createAuditLog } = require("../services/auditService");

// Create Post
const createPost = async (req, res, next) => {
  try {
    const post = await createPostService(req);

    await createAuditLog({
      req,
      module: "POST",
      action: "CREATE",
      targetId: post._id,
      targetType: "Post",
      description: "User created a post",
      success: true,
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Posts
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await getAllPostsService(req);

    res.status(200).json({
      posts,
      message: "Posts fetched successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Post By ID
const getPostById = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// Get Posts By User
const getPostsByUserId = async (req, res, next) => {
  try {

    const posts = await getPostsByUserIdService(req);

    if (!posts) {
      return res.status(201).json({
        message: "No posts found for this user",
      });
    }

    res.json({ posts });
  } catch (error) {
    next(error);
  }
};

// Delete Post
const deletePost = async (req, res, next) => {
  try {
    await deletePostService(req);

    await createAuditLog({
      req,
      module: "POST",
      action: "DELETE",
      targetId: req.params.id,
      targetType: "Post",
      description: "User deleted a post",
      success: true,
    });

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
  deletePost,
};