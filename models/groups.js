const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    description: {
      type: String,
      trim: true,
    },
    
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    inviteOnly: {
      type: Boolean,
      default: true,
    },

    maxMembers: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
