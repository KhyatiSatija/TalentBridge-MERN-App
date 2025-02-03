const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, { timestamps: true });

companySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//static method to validate credentials
companySchema.statics.login = async function ({ email, password }) {
  const company = await this.findOne({ email });
  if (!company) throw new Error('Invalid email or password');
  const isPasswordValid = await bcrypt.compare(password, company.password);
  if (!isPasswordValid) throw new Error('Invalid password');
  return company;
};

module.exports = mongoose.model('Company', companySchema);
 