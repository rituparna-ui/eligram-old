const mongoose = require('mongoose');

module.exports = (db) => {
  return mongoose.connect(db);
};
