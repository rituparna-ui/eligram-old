const User = require('./../models/user.model');

exports.postFollow = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      _id: req.body.userIdToFollow,
    }).select('followers following');
    // console.log(existingUser);

    if (!existingUser) {
      return res.end();
    }
    // console.log(existingUser.followers.includes(req.user._id));
    if (req.user.following.includes(req.body.userIdToFollow)) {
      await req.user.following.pull(req.body.userIdToFollow);
      await existingUser.followers.pull(req.user._id.toString());
      await req.user.save();
      await existingUser.save();
      return res.json({
        follow: false,
      });
    }

    await req.user.following.push(req.body.userIdToFollow);
    await existingUser.followers.push(req.user._id.toString());
    await req.user.save();
    await existingUser.save();
    return res.json({
      follow: true,
    });
  } catch (error) {
    console.error(error);
    res.end();
  }
};
