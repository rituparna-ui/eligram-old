const getHome = (req, res) => {
  res.render('home', {
    username: req.user.username,
  });
};

module.exports = { getHome };
