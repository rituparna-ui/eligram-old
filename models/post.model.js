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
    username: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.virtual('noLikes').get(function () {
  return this.likes.length;
});

postSchema.virtual('noComments').get(function () {
  return this.comments.length;
});

module.exports = mongoose.model('Post', postSchema);
