const express = require("express")

const { cretaeNewGroup, getGroups, sendGroupMessage, getGroupsMessage, addGropuMembers, deleteGroupByCreator } = require("../controllers/groupControllers")

const { protect } = require("../middlewares/authMiddleware");
const multer = require("multer")
const router = express.Router();

const { groupImageStorage } = require("../config/cloudConfig")
const { createGroupSchema ,sendGroupMessageSchema,addGroupMembersSchema} = require('../validations/groupValidation')
const validate = require('../middlewares/validate')

const storage = multer.memoryStorage();

const upload = multer({ storage })

router.post("/", validate(createGroupSchema), upload.single('groupIcon'), protect, cretaeNewGroup)

router.get("/", protect, getGroups)
router.get("/messages/:groupId", protect, getGroupsMessage)

router.post("/message",validate(sendGroupMessageSchema), protect, sendGroupMessage);

router.post("/add-members",validate(addGroupMembersSchema), protect, addGropuMembers);

router.delete("/delete-group/:groupId", protect, deleteGroupByCreator)


module.exports = router;