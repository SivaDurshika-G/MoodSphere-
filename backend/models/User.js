const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date },
  reminderTime: { type: String, default: null }, // <-- Added this line
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hide sensitive fields in JSON responses
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.otp;
    delete ret.otpExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
