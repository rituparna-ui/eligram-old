const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const mailer = require('./../utils/mailer');
const otpgen = require('./../utils/otpgen');

const User = require('./../models/user.model');

const getSignUp = (req, res) => {
  res.render('signup', {
    errorMsg: '',
  });
};

const getLogin = (req, res) => {
  const success =
    Boolean(req.flash('signupsuccess')[0]) === true ? true : false;
  const notFound = Boolean(req.flash('notfound')[0]) === true ? true : false;
  const invalid = Boolean(req.flash('invalid')[0]) === true ? true : false;
  // console.log(x);
  res.render('login', {
    success,
    notFound,
    invalid,
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    req.flash('notfound', 'true');
    return res.redirect('/auth/login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  // console.log(isMatch);
  if (!isMatch) {
    req.flash('invalid', 'true');
    return res.redirect('/auth/login');
  }

  if (!user.isVerified) {
    return res.render('verify', {
      id: user._id,
      err: false,
    });
  }

  req.session.loggedin = true;
  await req.session.save();
  res.redirect('/');
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

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = new User({ ...req.body, password: hashedPassword });
  user.otp = otpgen();
  const savedUser = await user.save();
  mailer.OTPmail(savedUser.email, user.otp, savedUser._id);
  req.flash('signupsuccess', 'true');
  return res.redirect('/auth/login');
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
};
