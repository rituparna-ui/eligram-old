const User = require('./../models/user.model');
const Post = require('./../models/post.model');
const mongoose = require('mongoose');

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
    '-_id username firstname lastname profileUrl'
  );

  shuffleArray(allUsers);

  const noFollowPre = allUsers.filter(
    (e) => !req.user.following.includes(e.username)
  );

  const noFollow = noFollowPre.filter((e) => e.username != req.user.username);
  shuffleArray(noFollow);

  const postArray = [];
  const follows = req.user.following;

  for (const username of follows) {
    const f = await User.findOne({ username }).select('posts -_id');
    postArray.push(...f.posts);
  }

  shuffleArray(postArray);
  const renderingPostsArrayOfIds = postArray.slice(0, 10);
  const renderingPostsArray = [];

  for (const postID of renderingPostsArrayOfIds) {
    const post = await Post.findOne({ _id: postID });
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
  if (!user) {
    return res.render('404');
  }
  let isFollowing = false;
  if (user.followers.includes(req.user.username)) {
    isFollowing = true;
  }
  return res.render('user/profile', {
    user,
    loggedIn: req.user.username,
    follows: isFollowing,
  });
};

module.exports = {
  getHome,
  getProfile,
};
