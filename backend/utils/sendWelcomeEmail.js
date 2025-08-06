const sendEmail = require('./sendEmail');

const sendWelcomeEmail = async (email, username) => {
  const subject = 'Welcome to MoodSphere!';
  const text = `Hi ${username},\n\nThanks for signing up to MoodSphere. We're glad to have you on board! 😊`;
  const html = `<p>Hi <strong>${username}</strong>,</p><p>Thanks for signing up to <b>MoodSphere</b>. We're glad to have you on board! 😊</p>`;

  await sendEmail({ to: email, subject, text, html });
};

module.exports = sendWelcomeEmail;
