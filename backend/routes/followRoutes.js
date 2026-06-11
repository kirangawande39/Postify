const express = require("express");
const { followUser, unfollowUser, removeFollower , declineUser, acceptUser, followBack } = require("../controllers/followController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();


router.put("/follow-back/:targetUserId", protect, followBack)
router.put("/follow-request/accept/:targetUserId" , protect , acceptUser)
router.post("/:targetUserId/follow", protect, followUser);
router.post("/:targetUserId/unfollow", protect, unfollowUser);

router.put("/remove-follower/:targetUserId",protect, removeFollower);

router.delete("/follow-request/decline/:targetUserId" , protect , declineUser)


module.exports = router;
