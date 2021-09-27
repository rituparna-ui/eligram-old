const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  posts: {
    type: [String],
    default: [],
    ref: 'Post',
  },
  profileUrl: {
    type: String,
    default: '/assets/img/sys/defaultprofile.jpg',
  },
  userBio: {
    type: String,
    default:
      'Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue Hue',
    maxlength: 400,
  },
  dob: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: Number,
  },
  otpExpiry: {
    type: Date,
    default: Date.now() + 3600000,
  },
  twoFA: {
    type: {
      ascii: String,
      hex: String,
      base32: String,
      otpauth_url: String,
    },
    default: {},
  },
  is2FAEnabled: {
    type: Boolean,
    default: false,
  },
  reqForPasswordReset: {
    type: Boolean,
    default: false,
  },
});

userSchema.index({ firstname: 'text', lastname: 'text' });

userSchema.virtual('fullname').get(function () {
  return this.firstname + ' ' + this.lastname;
});

userSchema.virtual('accountStats').get(function () {
  return {
    posts: this.posts.length,
    followers: this.followers.length,
    following: this.following.length,
  };
});

module.exports = mongoose.model('User', userSchema);
