const { validationResult } = require('express-validator');

const User = require('./../models/user.model');

const getSignUp = (req, res) => {
  res.render('signup');
};

const postSignUp = async (req, res) => {
  const errors = validationResult(req);

  const { email } = req.body;

  const existingEmail = await User.findOne({ email });
  // console.log(existingEmail); => null

  if (existingEmail) {
    
  }

  // console.log(errors);
  // console.log(errors.isEmpty());
  // console.log(errors.array());

  // const user = new User({
  //   ...req.body,
  // });
  // console.log(req.body);
  // user.save().then(() => {
  //   res.end();
  // });
};

module.exports = {
  getSignUp,
  postSignUp,
};
