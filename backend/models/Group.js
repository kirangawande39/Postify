const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    icon: {
        public_id: {
            type: String,
            default: "default_icon_public_id",
            required:true
        },
        url: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/615/615075.png",
            required:true
        }
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    privacy: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    }

},
    { timestamps: true }
)

module.exports = mongoose.model("Group", GroupSchema)