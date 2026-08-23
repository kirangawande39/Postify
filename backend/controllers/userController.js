const userServices = require("../services/userService");
const { createAuditLog } = require("../services/auditService");

const getUserProfile = async (req, res, next) => {
    try {
        const currentUserId = req.user.id;
        const profileUserId = req.params.id;

        const { profileUser, mutualList } =
            await userServices.getUserProfile(currentUserId, profileUserId);

        res.json({
            success: true,
            user: profileUser,
            mutualCount: mutualList?.length,
            mutualList
        });

    } catch (err) {
        next(err);
    }
};

const updateUserProfile = async (req, res, next) => {
    try {
        const result = await userServices.updateUserProfile(req);

        await createAuditLog({
            req,
            module: "USER",
            action: "PROFILE_UPDATE",
            targetId: req.user.id,
            targetType: "User",
            description: "User updated profile",
            success: true,
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

const followUser = async (req, res, next) => {
    try {
        const result = await userServices.followUser(req);
        res.send(result);
    } catch (err) {
        next(err);
    }
};

const unfollowUser = async (req, res, next) => {
    try {
        const result = await userServices.unfollowUser(req);
        res.send(result);
    } catch (err) {
        next(err);
    }
};

const searchUsers = async (req, res, next) => {
    try {
        const result = await userServices.searchUsers(req);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getSuggestedUsers = async (req, res) => {
    try {
        const result = await userServices.getSuggestedUsers(req);

        res.status(200).json(result);
    } catch (err) {
        console.error("Suggestion fetch failed:", err.message);
        res.status(500).json({ message: "Failed to fetch suggestions" });
    }
};

const uploadProfilePic = async (req, res) => {
    try {
        const result = await userServices.uploadProfilePic(req);

        await createAuditLog({
            req,
            module: "USER",
            action: "PROFILE_PICTURE_UPDATE",
            targetId: req.user.id,
            targetType: "User",
            description: "User updated profile picture",
            success: true,
        });

        res.json(result);
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const SaveFcmToken = async (req, res) => {
    try {
        await userServices.SaveFcmToken(req);

        await createAuditLog({
            req,
            module: "USER",
            action: "FCM_TOKEN_UPDATED",
            targetId: req.user.id,
            targetType: "User",
            description: "User updated FCM token",
            success: true,
        });
    } catch (error) {
        console.error("Error saving fcm token :", error);
        res.status(500).json({ message: "failed to saved fcm token" });
    }
};

const updatePrivacy = async (req, res) => {
    try {
        const result = await userServices.updatePrivacy(req);

        await createAuditLog({
            req,
            module: "USER",
            action: "PRIVACY_UPDATE",
            targetId: req.user.id,
            targetType: "User",
            description: "User updated privacy settings",
            success: true,
        });

        res.status(201).json(result);
    } catch (error) {
        console.error("Error to update privacy setting", error);
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    followUser,
    unfollowUser,
    searchUsers,
    getSuggestedUsers,
    uploadProfilePic,
    SaveFcmToken,
    updatePrivacy
};