const express = require("express");
const router = express.Router();

const {
  createComment,
  replyToComment,
  getComments,
  expandComments,
} = require("../controllers/commentController");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  createCommentLimiter,
  replyCommentLimiter,
} = require("../middlewares/rateLimitMiddleware");

router.post(
  "/posts/:postId/comments",
  authMiddleware, 
  createCommentLimiter, 
  createComment 
);

router.post(
  "/posts/:postId/comments/:commentId/reply",
  authMiddleware, 
  replyCommentLimiter, 
  replyToComment 
);

router.get(
  "/posts/:postId/comments",
  getComments 
);

router.get(
  "/posts/:postId/comments/:commentId/expand",
  expandComments 
);

module.exports = router;
