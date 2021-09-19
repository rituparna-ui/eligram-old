const mongoose = require('mongoose');

const User = require('./../models/user.model');
const Post = require('./../models/post.model');

mongoose
  .connect('mongodb://127.0.0.1:27017/huehue')
  .then(async () => {
    const lol = new User({
      firstName: 'ritu',
      lastName: 'W',
      username: 'rw',
      email: 'w@w.c',
      gender: 1,
      password: 'iukghvvalsdfjkn',
    });
    const x = await lol.save();
    console.log(x);
  })
  .catch((err) => {});
