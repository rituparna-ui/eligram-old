const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
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
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  following: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'User',
  },
  posts: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'Post',
  },
  profileUrl: {
    type: String,
    default: '/assets/img/sys/defaultprofile.jpg',
  },
  userBio: {
    type: String,
    default: 'Hue Hue',
  },
});

module.exports = mongoose.model('User', userSchema);
