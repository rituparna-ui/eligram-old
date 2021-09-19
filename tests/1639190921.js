const mongoose = require('mongoose');

const Post = require('./../models/post.model');

mongoose
  .connect('mongodb://127.0.0.1:27017/huehue')
  .then(() => {
    const post = new Post({
      imgUrl: 'imgurl',
      caption: 'lihfgas',
      likes: [mongoose.Types.ObjectId('614729d0b57eac4d7627512b')],
      comments: [
        {
          username: 'test',
          comment: 'hsaldjkf',
        },
        {
          username: 'test2',
          comment: 'hsaldjkxcdfgf',
          replies: [
            {
              username: 'hg',
              reply: 'jhgrfskjbrfsakejb',
            },
          ],
        },
      ],
    });
    post.save().then(() => {
      process.exit(0);
    });
  })
  .catch((err) => {});
