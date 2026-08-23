const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    actorEmail: {
      type: String,
      default: null,
      index: true,
    },

    module: {
      type: String,
      required: true,
      enum: [
        "AUTH",
        "USER",
        "POST",
        "COMMENT",
        "LIKE",
        "FOLLOW",
        "FOLLOW_REQUEST",
        "MESSAGE",
        "GROUP",
        "STORY",
        "CHAT",
        "CALL",
        "PASSWORD",
        "SYSTEM",
      ],
      index: true,
    },

    action: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    /*
     * Dynamic reference.
     *
     * targetType decides which model
     * targetId belongs to.
     */
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "targetType",
      default: null,
      index: true,
    },

    targetType: {
      type: String,
      enum: [
        "User",
        "Post",
        "Comment",
        "Like",
        "Follow",
        "FollowRequest",
        "Message",
        "Group",
        "Story",
        "Chat",
        "Call",
      ],
      default: null,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    success: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * ========================================
 * INDEXES
 * ========================================
 */

AuditLogSchema.index({ createdAt: -1 });

AuditLogSchema.index({
  module: 1,
  action: 1,
});

AuditLogSchema.index({
  actor: 1,
  createdAt: -1,
});

AuditLogSchema.index({
  targetId: 1,
  targetType: 1,
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);