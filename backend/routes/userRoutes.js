const express = require("express");
const { getUserProfile, updateUserProfile, followUser, unfollowUser, searchUsers, getSuggestedUsers, uploadProfilePic, SaveFcmToken, updatePrivacy } = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { updateUserProfileSchema, saveFcmTokenSchema, updatePrivacySchema } = require('../validations/userValidation')
const validate = require('../middlewares/validate')

const router = express.Router();
const User = require('../models/User');


const multer = require('multer');
const { profilePicStorage } = require('../config/cloudConfig');

const storage =
    multer.memoryStorage();

const upload = multer({
    storage,
});




// Multer setup


router.get('/suggestions', protect, getSuggestedUsers);


router.get("/search", protect, searchUsers);

router.get("/:id", protect, getUserProfile);

router.put("/privacy", validate(updatePrivacySchema), protect, updatePrivacy)
router.put("/:id", validate(updateUserProfileSchema), protect, updateUserProfile);

// Update profile
router.post("/:id/follow", protect, followUser); // Follow a user
router.post("/:id/unfollow", protect, unfollowUser); // Unfollow a user






router.put('/:id/uploadProfilePic', protect, upload.single('profilePic'), uploadProfilePic);



router.post('/save-fcm-token', validate(saveFcmTokenSchema), protect, SaveFcmToken)






module.exports = router;
