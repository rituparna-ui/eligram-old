const getHome = (req, res) => {
  res.render('home', {
    username: 'ritu.parna',
  });
};

module.exports = { getHome };
