module.exports = () => {
  let OTP = parseInt(Math.random() * 1000000);
  while (OTP < 100000) {
    OTP *= 10;
  }
  return OTP;
};
