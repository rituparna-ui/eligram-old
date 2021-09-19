const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
  {
    username: String,
    reply: String,
  },
  {
    timestamps: true,
  }
);

const commentSchema = new mongoose.Schema(
  {
    username: String,
    comment: String,
    replies: [{ type: replySchema, default: [] }],
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    imgUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
