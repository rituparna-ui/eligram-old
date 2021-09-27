const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const mailer = require('./../utils/mailer');
const otpgen = require('./../utils/otpgen');

const User = require('./../models/user.model');

const getSignUp = (req, res) => {
  if (req.session.loggedin) {
    return res.redirect('back');
  }
  res.render('auth/signup', {
    errorMsg: '',
  });
};

const getLogin = (req, res) => {
  if (req.session.loggedin) {
    return res.redirect('back');
  }
  const success =
    Boolean(req.flash('signupsuccess')[0]) === true ? true : false;
  const notFound = Boolean(req.flash('notfound')[0]) === true ? true : false;
  const invalid = Boolean(req.flash('invalid')[0]) === true ? true : false;
  // console.log(x);
  res.render('auth/login', {
    success,
    notFound,
    invalid,
    msg: req.flash('msg'),
  });
};

const postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (email.includes('@')) {
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
      return res.render('auth/verify', {
        id: user._id,
        err: false,
      });
    }

    if (user.is2FAEnabled) {
      console.log('user._id');
      return res.render('auth/2fa/verify2fa', {
        uid: user._id,
      });
    }

    req.session.loggedin = true;
    req.session.uid = user._id.toString();
    await req.session.save();
    req.user = user;
    res.redirect('/');
  } else {
    const user = await User.findOne({ username: email });
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
      return res.render('auth/verify', {
        id: user._id,
        err: false,
      });
    }

    if (user.is2FAEnabled) {
      return res.render('auth/2fa/verify2fa', {
        uid: user._id,
      });
    }

    req.session.loggedin = true;
    req.session.uid = user._id.toString();
    req.session.user = user;
    await req.session.save();
    res.redirect('/');
  }
};

const postDeleteAccount = async (req, res) => {
  try {
    const x = await User.findOneAndDelete({ _id: req.body._id.toString() });
    // console.log(x);
    req.session.destroy();
    req.session.save();
    res.redirect('/');
  } catch (error) {
    return res.redirect('/');
  }
};

const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

const postSignUp = async (req, res) => {
  const errors = validationResult(req);

  // console.log(errors);
  // console.log(errors.isEmpty());
  // console.log(errors.array());

  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.render('auth/signup', {
      errorMsg: req.flash('error'),
    });
  }

  const { email, username, password, confirmPassword } = req.body;

  const existingEmail = await User.findOne({ email });
  // console.log(existingEmail); => null

  if (existingEmail) {
    req.flash('error', 'Email Already Exists');
    return res.render('auth/signup', {
      errorMsg: req.flash('error'),
    });
  }

  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    req.flash('error', 'Username Already Exists, Please grab another one');
    return res.render('auth/signup', {
      errorMsg: req.flash('error'),
    });
  }

  if (password != confirmPassword) {
    req.flash('error', 'Passwords do not match');
    return res.render('auth/signup', {
      errorMsg: req.flash('error'),
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = new User({ ...req.body, password: hashedPassword });
  user.otp = otpgen();
  const savedUser = await user.save();
  mailer.OTPmail(savedUser.email, user.otp, savedUser._id.toString());
  req.flash('signupsuccess', 'true');
  return res.redirect('/auth/login');
};

const getVerifyOTP = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const otp = req.query.otp || req.body.otp;
  const user = await User.findById(id);
  if (!user) {
    req.flash('msg', 'User Not Found !');
    return res.redirect('/auth/login');
  }
  if (user.otp === parseInt(otp)) {
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    // req.flash('msg', 'Account Verified, ');
    req.session.loggedin = true;
    req.session.uid = user._id.toString();
    return res.redirect('/');
  }
  return res.render('auth/verify', {
    err: true,
    id: user._id,
  });
};

const postResendOTP = async (req, res) => {
  // console.log(req.body);
  const user = await User.findById(req.body.id);
  if (!user) {
    return;
  }

  user.otp = otpgen();
  await user.save();
  mailer
    .OTPmail(user.email, user.otp, user._id.toString())
    .then(() => {
      console.log('Sent to ' + user.email);
      res.json({ status: 'otp sent' });
    })
    .catch((e) => {
      console.log('could not send');
    });
};

const post2fa = async (req, res) => {
  const { totp } = req.body;
  const isCorrect = speakeasy.totp.verify({
    secret: req.user.twoFA.base32,
    token: totp,
    encoding: 'base32',
    window: 3,
  });
  if (!isCorrect) {
    req.flash('totperror', 'Invalid TOTP');
    return res.redirect('/settings');
  } else {
    req.user.is2FAEnabled = true;
    await req.user.save();
    req.flash('totperror', '2FA Enabled');
    return res.redirect('/settings');
  }
};

const postEnable2fa = async (req, res) => {
  if (req.user.is2FAEnabled) {
    return res.redirect('/settings');
  }
  const secret = speakeasy.generateSecret({
    issuer: 'Eligram',
    name: 'Eligram@' + req.user.fullname,
  });

  req.user.twoFA = secret;
  try {
    await req.user.save();
    qrcode.toDataURL(req.user.twoFA.otpauth_url, (e, u) => {
      res.render('auth/2fa/step1', {
        user: req.user,
        qrBase64: u,
      });
    });
  } catch (error) {
    res.send('Error 500');
  }
};

const verify2fa = async (req, res) => {
  const { totp, id } = req.body;
  const user = await User.findOne({ _id: id });
  const isCorrect = speakeasy.totp.verify({
    secret: user.twoFA.base32,
    token: totp,
    encoding: 'base32',
    window: 3,
  });
  if (!isCorrect) {
    req.flash('invalid', true);
    return res.redirect('/');
  } else {
    req.session.loggedin = true;
    req.session.uid = user._id.toString();
    return res.redirect('/');
  }
};

const disable2fa = async (req, res) => {
  req.user.is2FAEnabled = false;
  req.user.twoFA = null;
  await req.user.save();
  res.json({
    disabled: true,
  });
};

const getForgotPassword = (req, res) => {
  res.render('auth/forgot', {
    notFound: req.flash('notFound').length > 0,
  });
};

const postForgotPassword = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    req.flash('notFound', true);
    return res.redirect('back');
  }
  existingUser.reqForPasswordReset = true;
  await existingUser.save();
  
};

module.exports = {
  getSignUp,
  postSignUp,
  getLogin,
  postLogin,
  getVerifyOTP,
  postResendOTP,
  postDeleteAccount,
  logout,
  postEnable2fa,
  post2fa,
  verify2fa,
  disable2fa,
  getForgotPassword,
  postForgotPassword,
};
