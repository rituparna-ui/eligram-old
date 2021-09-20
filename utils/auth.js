module.exports = (req, res, next) => {
  if (!req.session.loggedin) {
    req.flash('msg', 'Please log in to continue');
    return res.redirect('/auth/login');
  }
  next();
};
