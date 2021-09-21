exports.postFollow = async (req, res) => {
  // console.log(req.user.username);
  console.log(req.body);
  console.log(req.user.following);
  await req.user.following.push(req.body.usernameToFollow);
  await req.user.save();
  res.end();
};
