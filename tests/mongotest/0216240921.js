const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
});

const Person = mongoose.model('Person', personSchema);

mongoose.connect('mongodb://127.0.0.1:27017/ritu', async (x) => {
  const ritu = await Person.findOne({
    _id: '614ce8b8764747bea00da9c6',
  });
  console.log(ritu);
  console.log(ritu._id.toString());
  console.log(typeof ritu._id);
  mongoose.disconnect();
});
