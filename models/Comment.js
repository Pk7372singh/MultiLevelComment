const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postId: { type: Number, required: true },
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentCommentId",
});

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Comment", CommentSchema);
