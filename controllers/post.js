const sharp = require('sharp');
const fs = require('fs');

const Post = require('./../models/post.model');

exports.getNewPost = (req, res) => {
  res.render('post/addPost');
};

exports.postNewPost = async (req, res) => {
  const image = req.file;

  if (!image) {
    return res.send('unsucessful');
  }

  // 480×360

  const fileNameAndPath =
    'assets/user/uploads/images/' +
    Date.now() +
    image.originalname.split('.')[0] +
    '.jpg';

  await sharp(image.path)
    .resize(480, 480)
    .jpeg({ quality: 100 })
    .toFile(fileNameAndPath);

  fs.unlink(image.path, () => {});
  // const imgUrl = image.path.replace(/\\/g, '/');
  const post = new Post({
    imgUrl: '/' + fileNameAndPath,
    caption: 'Test Image',
  });
  const saved = await post.save();
  console.log(saved);
};
