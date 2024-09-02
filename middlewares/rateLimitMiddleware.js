const rateLimit = require("express-rate-limit");

const createCommentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message:
    "Too many comments created from this IP, please try again after 15 minutes",
});

const replyCommentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20,
  message:
    "Too many replies created from this IP, please try again after 15 minutes",
});

module.exports = { createCommentLimiter, replyCommentLimiter };
