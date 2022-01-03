const User = require('./../models/user.model');

const { sendNoti } = require('./../utils/push');

const bcrypt = require('bcryptjs');

exports.postFollow = async (req, res) => {
  try {
    const existingUser = await User.findOne({
      _id: req.body.userIdToFollow,
    }).select('followers following push');
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
      sendNoti(
        existingUser.push,
        JSON.stringify({ title: `${req.user.firstname} unfollowed you` })
      );
      return res.json({
        follow: false,
      });
    }

    await req.user.following.push(req.body.userIdToFollow);
    await existingUser.followers.push(req.user._id.toString());
    await req.user.save();
    await existingUser.save();
    sendNoti(
      existingUser.push,
      JSON.stringify({ title: `${req.user.firstname} started following you` })
    );
    return res.json({
      follow: true,
    });
  } catch (error) {
    console.error(error);
    res.end();
  }
};

exports.changepwd = async (req, res) => {
  const { oldPwd, newPwd } = req.body;
  const compare = await bcrypt.compare(oldPwd, req.user.password);
  if (compare) {
    const newHashed = await bcrypt.hash(newPwd, 12);
    req.user.password = newHashed;
    try {
      await req.user.save();
      return res.json({
        change: true,
      });
    } catch (error) {
      return res.json({
        change: false,
      });
    }
  }
  return res.json({
    change: false,
  });
};
