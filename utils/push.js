const push = require('web-push');

const vapid = {
  publicKey:
    'BJie5SFmVxKxj-DG4roJi5G85n5M4IcUXKfjGkR4dAPtGRb9eqBSwQ_lryDcjBAbK4UsHmaaiZSVS6XC6TcqLkk',
  privateKey: 'jPnMDfR4RK3W4Jizl35WVzwqe7PX87f1AeZS5n775Wg',
};

push.setVapidDetails(
  'mailto:rwarwatkar@gmail.com',
  vapid.publicKey,
  vapid.privateKey
);

const sendNoti = async (subscription, message) => {
  try {
    await push.sendNotification(subscription, message);
    console.log('push sent');
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  sendNoti,
};
