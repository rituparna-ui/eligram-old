const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rituw1610@gmail.com',
    pass: process.env.A_MAIL_PWD,
  },
});

const OTPmail = (email, OTP, id) => {
  const promise = new Promise((res, rej) => {
    transporter.sendMail(
      {
        from: '"Eligram" rituw1610@gmail.com',
        to: email,
        subject: 'Verify your sign up',
        html: `<h3>Below is your one time password:</h3><h2>${OTP}</h2>Or click on the link to <strong><a href="http://localhost:3000/auth/verify/${id}?otp=${OTP}">Verify Account</a><strong><br/>This OTP and verification link is valid for 1 hour<br/><br/>Team Eligram`,
      },
      (e) => {
        if (e) {
          rej(e);
        } else {
          res('OTP mail sent');
        }
      }
    );
  });
  return promise;
};

module.exports = { OTPmail };
