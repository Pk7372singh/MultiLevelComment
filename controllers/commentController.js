const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  const { postId, text } = req.body;
  const userId = req.user.id;

  if (!postId || !text) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const comment = new Comment({ postId, text, userId });
    await comment.save();
    res.status(201).json(comment); 
  } catch (err) {
    console.error(err); 
    res.status(500).send("Server error");
  }
};

exports.replyToComment = async (req, res) => {
  const { postId, text } = req.body;
  const { commentId } = req.params;
  const userId = req.user.id;

  if (!postId || !text || !commentId) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const reply = new Comment({
      postId,
      text,
      userId,
      parentCommentId: commentId,
    });
    await reply.save();
    res.status(201).json(reply); 
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.getComments = async (req, res) => {
  const { postId } = req.params;
  const { sortBy = 'createdAt', sortOrder = 'asc' } = req.query;

  if (!['createdAt', 'text'].includes(sortBy)) {
    return res.status(400).send("Invalid sortBy field");
  }
  if (!['asc', 'desc'].includes(sortOrder)) {
    return res.status(400).send("Invalid sortOrder field");
  }

  try {
    const comments = await Comment.find({ postId, parentCommentId: null })
      .sort({ [sortBy]: sortOrder })
      .populate({
        path: 'replies',
        select: 'text createdAt',
        options: { limit: 2 }, 
      })
      .exec();

    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.expandComments = async (req, res) => {
  const { postId, commentId } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSizeNumber = parseInt(pageSize, 10);

  if (isNaN(pageNumber) || isNaN(pageSizeNumber) || pageNumber < 1 || pageSizeNumber < 1) {
    return res.status(400).send("Invalid pagination parameters");
  }

  try {
    const comments = await Comment.find({ postId, parentCommentId: commentId })
      .skip((pageNumber - 1) * pageSizeNumber)
      .limit(pageSizeNumber)
      .exec();

    res.json(comments);
  } catch (err) {
    console.error(err); 
    res.status(500).send("Server error");
  }
};
