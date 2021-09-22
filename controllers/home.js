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
  const allUsers = await await User.find({}).select(
    '-_id username firstname lastname profileUrl'
  );

  shuffleArray(allUsers);

  // allUsers - following = non following
  const noFollowPre = allUsers.filter(
    (e) => !req.user.following.includes(e.username)
  );

  // console.log(noFollowPre);
  // shuffleArray(noFollowPre);

  const noFollow = noFollowPre.filter((e) => e.username != req.user.username);

  shuffleArray(noFollow);

  return res.render('home', {
    user: req.user,
    suggested: noFollow.slice(0, 10),
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
