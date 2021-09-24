const fs = require('fs');
const sharp = require('sharp');

const User = require('./../models/user.model');
const Post = require('./../models/post.model');

const { validationResult } = require('express-validator');

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const getHome = async (req, res) => {
  const allUsers = await User.find({}).select(
    'username firstname lastname profileUrl'
  );

  shuffleArray(allUsers);

  const noFollowPre = allUsers.filter(
    (e) => !req.user.following.includes(e._id.toString())
  );

  const noFollow = noFollowPre.filter(
    (e) => e._id.toString() != req.user._id.toString()
  );
  shuffleArray(noFollow);

  const postArray = [];
  const follows = req.user.following;

  for (const id of follows) {
    const f = await User.findOne({ _id: id }).select('posts username');
    postArray.push(...f.posts);
  }

  shuffleArray(postArray);
  const renderingPostsArrayOfIds = postArray.slice(0, 10);
  const renderingPostsArray = [];

  for (const postID of renderingPostsArrayOfIds) {
    const post = await Post.findOne({ _id: postID }).populate(
      'userId',
      'username profileUrl -_id'
    );
    renderingPostsArray.push(post);
  }

  return res.render('user/home', {
    user: req.user,
    suggested: noFollow.slice(0, 10),
    feed: renderingPostsArray,
  });
};

const getProfile = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  const posts = [];
  let isFollowing = false;

  if (!user) {
    return res.render('404');
  }

  if (user.followers.includes(req.user._id.toString())) {
    isFollowing = true;
  }

  for (const post of user.posts) {
    const x = await Post.findById(post).select('imgUrl caption');
    posts.push(x);
  }
  // console.log(posts)
  return res.render('user/profile', {
    user,
    loggedIn: req.user.username,
    follows: isFollowing,
    update: req.flash('update'),
    posts,
  });
};

const getSettings = async (req, res) => {
  res.render('user/settings', {
    user: req.user,
    errorMsg: '',
    totperror: req.flash('totperror'),
  });
};

const postSettings = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.render('user/settings', {
      errorMsg: req.flash('error'),
      user: req.user,
    });
  }

  if (!req.file) {
    if (req.body.changeUsername === 'on') {
      const existingUsername = await User.findOne({
        username: req.body.username,
      }).select('username');
      if (existingUsername) {
        return res.render('user/settings', {
          errorMsg: 'Username already exists, Please try another',
          user: req.user,
        });
      }
    }

    req.user.firstname = req.body.firstname;
    req.user.lastname = req.body.lastname;
    req.user.username = req.body.username;
    req.user.userBio = req.body.bio;

    await req.user.save();
    req.flash('update', '1');
    return res.redirect('/profile/' + req.user.username);
  } else {
    const fileNameAndPath =
      'assets/user/uploads/images/profile/' +
      Date.now() +
      req.file.originalname.split('.')[0] +
      '.jpg';

    await sharp(req.file.path)
      .resize(240, 240)
      .withMetadata()
      .toFile(fileNameAndPath);

    fs.unlink(req.file.path, () => {});

    req.user.firstname = req.body.firstname;
    req.user.lastname = req.body.lastname;
    req.user.username = req.body.username;
    req.user.userBio = req.body.bio;
    req.user.profileUrl = '/' + fileNameAndPath;

    await req.user.save();
    req.flash('update', '1');
    return res.redirect('/profile/' + req.user.username);
  }
};

module.exports = {
  getHome,
  getProfile,
  getSettings,
  postSettings,
};
