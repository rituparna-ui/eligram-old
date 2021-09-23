const sharp = require('sharp');
const fs = require('fs');

const Post = require('./../models/post.model');

exports.getNewPost = (req, res) => {
  res.render('post/addPost', {
    user: req.user,
  });
};

exports.postNewPost = async (req, res) => {
  const image = req.file;

  if (!image) {
    return res.send('unsucessful');
  }

  const fileNameAndPath =
    'assets/user/uploads/images/' +
    Date.now() +
    image.originalname.split('.')[0] +
    '.jpg';

  await sharp(image.path)
    .rotate()
    .resize(480, 480)
    .png({ quality: 100 })
    .withMetadata('png')
    .toFile(fileNameAndPath);

  fs.unlink(image.path, () => {});
  const post = new Post({
    imgUrl: '/' + fileNameAndPath,
    caption: req.body.caption,
    userId: req.user._id.toString(),
  });

  const savedPost = await post.save();
  req.user.posts.push(savedPost._id.toString());
  await req.user.save();
  res.redirect('/');
};
