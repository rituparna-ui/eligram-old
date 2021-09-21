const User = require('./../models/user.model');

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

const getHome = async (req, res) => {
  // const allUsers = await User.find({}).select('_id');
  // console.log(allUsers);
  // const { followers } = await User.findById(req.user._id).select(
  //   'followers -_id'
  // );
  // const suggestedFollowers = allUsers.filter((x) => !followers.includes(x));
  // console.log(followers);

  const allUsers = await await User.find({}).select(
    'username -_id firstname lastname profileUrl'
  );
  shuffleArray(allUsers);
  res.render('home', {
    user: req.user,
    suggested: allUsers.slice(0, 5),
  });
};

const getProfile = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render('404');
  }
  return res.render('profile', {
    user,
  });
};

module.exports = {
  getHome,
  getProfile,
};
