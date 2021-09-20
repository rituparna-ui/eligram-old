const { validationResult } = require('express-validator');
const mailer = require('./../utils/mailer');
const otpgen = require('./../utils/otpgen');

const User = require('./../models/user.model');

const getSignUp = (req, res) => {
  res.render('signup', {
    errorMsg: '',
  });
};

const getLogin = (req, res) => {
  res.render('login', {
    accountCreated: req.flash('accountCreated'),
  });
};

const postLogin = (req, res) => {
  console.log(req.body);
};

const postSignUp = async (req, res) => {
  const errors = validationResult(req);

  // console.log(errors);
  // console.log(errors.isEmpty());
  // console.log(errors.array());

  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.render('signup', {
      errorMsg: req.flash('error'),
    });
  }

  const { email, username, password, confirmPassword } = req.body;

  const existingEmail = await User.findOne({ email });
  // console.log(existingEmail); => null

  if (existingEmail) {
    req.flash('error', 'Email Already Exists');
    return res.render('signup', {
      errorMsg: req.flash('error'),
    });
  }

  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    req.flash('error', 'Username Already Exists, Please grab another one');
    return res.render('signup', {
      errorMsg: req.flash('error'),
    });
  }

  if (password != confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.render('signup', {
      errorMsg: req.flash('error'),
    });
  }

  const user = new User(req.body);
  user.otp = otpgen();
  const savedUser = await user.save();
  mailer.OTPmail(savedUser.email, user.otp, savedUser._id);
  req.flash('accountCreated', 'Account Created Successfully');
  return res.redirect('/auth/login', {
    accountCreated: req.flash('accountCreated'),
  });
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
};
