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

  const fileNameAndPath = (
    'assets/user/uploads/images/' +
    Date.now() +
    image.originalname.split('.')[0] +
    '.jpg'
  )
    .split(' ')
    .join('');

  try {
    const width = 240;
    const height = 60;
    const text = req.user.username + '@Eligram';

    const svgImage = `
      <svg width="${width}" height="${height}">
        <style>
        .title { fill: #001; font-size: 24px; font-weight: bold;}
        </style>
        <text x="50%" y="50%" text-anchor="middle" class="title" opacity="0.5">${text}</text>
      </svg>
      `;
    const svgBuffer = Buffer.from(svgImage);

    await sharp(image.path)
      .resize(480, 480)
      .withMetadata()
      .composite([
        {
          input: svgBuffer,
          gravity: 'southeast',
        },
      ])
      .toFile(fileNameAndPath);
  } catch (error) {
    console.log(error);
  }

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

exports.getPost = async (req, res) => {
  const postID = req.params.pid;
  try {
    const post = await Post.findById(postID);
    res.render('post/post', {
      post,
      user: req.user,
    });
  } catch (error) {
    res.render('404');
  }
};
