const User = require('./../models/user.model');

const getHome = (req, res) => {
  res.render('home', {
    user: req.user,
  });
};

const getProfile = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render('404');
  }
  return res.render('profile', {
    user,
  });
};

module.exports = {
  getHome,
  getProfile,
};
