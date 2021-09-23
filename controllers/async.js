const User = require('./../models/user.model');

exports.postFollow = async (req, res) => {
  // console.log(req.user.username);
  // console.log(req.user.following);
  if (req.user.following.includes(req.body.usernameToFollow)) {
    req.user.following.pull(req.body.usernameToFollow);
    await req.user.save();
    return res.json({
      follow: false,
    });
  }

  const existingUser = await User.findOne({
    username: req.body.usernameToFollow,
  });

  if (!existingUser) {
    return res.end();
  }

  await req.user.following.push(req.body.usernameToFollow);
  await req.user.save();
  res.json({
    follow: true,
  });
};
