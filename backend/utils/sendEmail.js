// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (to, username) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Use App Password if 2FA is enabled
      },
    });

    const mailOptions = {
      from: `"MoodSphere" <${process.env.GMAIL_USER}>`,
      to,
      subject: 'Welcome to MoodSphere 🎉',
      html: `
        <h2>Hi ${username},</h2>
        <p>Welcome to <strong>MoodSphere</strong>!</p>
        <p>We're excited to have you on board. Start tracking your moods and reflect on your journey.</p>
        <p>Cheers,<br/>The MoodSphere Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent to", to);
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

module.exports = sendWelcomeEmail;
