module.exports = (req, res, next) => {
  if (!req.session.loggedin) {
    return res.redirect('/auth/login');
  }
  next();
};
