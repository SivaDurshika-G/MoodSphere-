const sendEmail = require('./sendEmail');

const sendOtpEmail = async (email, otp) => {
  const subject = 'Your OTP for Password Reset';
  const text = `Your OTP is ${otp}. It will expire in 10 minutes.`;
  const html = `<p>Your OTP is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`;

  await sendEmail({ to: email, subject, text, html });
};

module.exports = sendOtpEmail;
