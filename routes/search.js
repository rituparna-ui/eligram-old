const express = require('express');
const router = express.Router();

const User = require('./../models/user.model');

router.get('/search', async (req, res) => {
  console.log(req.query.query);

  const searchResult = await User.find({
    $or: [
      { firstname: new RegExp(`.*${req.query.query}.*`, 'ig') },
      { lastname: RegExp(`.*${req.query.query}.*`, 'ig') },
    ],
  }).select('firstname lastname username profileUrl');

  console.log(searchResult);

  res.end();
});

module.exports = router;
