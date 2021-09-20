const getHome = (req, res) => {
  res.render('home', {
    user: req.user,
  });
};

const getProfile = (req, res) => {
  res.render('profile', {
    user: req.user,
  });
};

module.exports = {
  getHome,
  getProfile,
};
