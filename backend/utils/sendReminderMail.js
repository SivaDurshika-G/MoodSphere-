// utils/sendReminderMail.js
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,      // your Gmail address
    pass: process.env.GMAIL_PASS,      // your Gmail app password
  },
});

const sendReminderEmail = async (user) => {
  const mailOptions = {
    from: `"MoodSphere Reminder" <${process.env.GMAIL_USER}>`,
    to: user.email,
    subject: 'Mood Entry Reminder',
    html: `
      <h3>Hello ${user.name || 'there'},</h3>
      <p>This is your daily reminder to log your mood on <strong>MoodSphere</strong>.</p>
      <p><a href="${process.env.FRONTEND_URL}" target="_blank">Click here to log your mood</a></p>
      <br>
      <p>— MoodSphere Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending reminder:', error.message);
  }
};

// Scheduler setup
const scheduledJobs = {};

const scheduleReminder = (user) => {
  // If job exists, cancel it first
  if (scheduledJobs[user._id]) {
    scheduledJobs[user._id].stop();
    delete scheduledJobs[user._id];
  }

  const [hour, minute] = user.reminderTime.split(':');
  const cronExpression = `${minute} ${hour} * * *`; // daily at HH:MM

  const job = cron.schedule(cronExpression, () => sendReminderEmail(user), {
    timezone: 'Asia/Kolkata',
  });

  scheduledJobs[user._id] = job;
};

// Exports
module.exports = {
  sendReminderEmail,
  scheduleReminder,
};
