const express = require('express');
const router = express.Router();

const User = require('./../models/user.model');

router.get('/search', async (req, res) => {
  // console.log(req.query.query);

  if (!req.query.query.includes(' ')) {
    const searchResults = await User.find({
      $or: [
        {
          firstname: new RegExp(`.*${req.query.query}.*`, 'ig'),
        },
        { lastname: new RegExp(`.*${req.query.query}.*`, 'ig') },
      ],
    }).select('firstname lastname username profileUrl');

    // console.log(searchResults);

    res.render('search/search', {
      query: req.query.query,
      user: req.user,
      searchResults,
    });
  } else {
    const q1 = req.query.query.split(' ')[0];
    const q2 = req.query.query.split(' ')[1];

    const searchResults = await User.find({
      $or: [
        {
          firstname: new RegExp(`.*${q1}.*`, 'ig'),
        },
        { lastname: new RegExp(`.*${q1}.*`, 'ig') },
        {
          firstname: new RegExp(`.*${q2}.*`, 'ig'),
        },
        { lastname: new RegExp(`.*${q2}.*`, 'ig') },
      ],
    }).select('firstname lastname username profileUrl');

    res.render('search/search', {
      query: req.query.query,
      user: req.user,
      searchResults,
    });
  }
});

module.exports = router;
