const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const developerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
      message: 'Invalid email format',
    },
},
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },

  phoneNumber: { 
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: (value) => /^\d{10}$/.test(value),
      message: 'Invalid phone number',
    },
   },
   resetPasswordToken: { type: String },
   resetPasswordExpires: { type: Date },
}, 
  { timestamps: true }
);

// Pre-save hook to hash passwords before saving
developerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to validate credentials
developerSchema.statics.login = async function ({ email, password }) {
  const developer = await this.findOne({ email });
  if (!developer) throw new Error('Invalid email or password');
  const isPasswordValid = await bcrypt.compare(password, developer.password);
  if (!isPasswordValid) throw new Error('Invalid password');
  return developer;
};

module.exports = mongoose.model('Developer', developerSchema);
