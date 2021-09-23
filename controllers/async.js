const User = require('./../models/user.model');

exports.postFollow = async (req, res) => {
  if (req.user.following.includes(req.body.usernameToFollow)) {
    req.user.following.pull(req.body.usernameToFollow);
    const userToRemove = await User.findOne({
      username: req.body.usernameToFollow,
    });
    await userToRemove.followers.pull(req.user.username);
    await userToRemove.save();
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

  existingUser.followers.push(req.user.username);
  await existingUser.save();

  await req.user.following.push(req.body.usernameToFollow);
  await req.user.save();
  res.json({
    follow: true,
  });
};
