const Developer = require('../../models/developer');
const Company = require('../../models/company');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');
require('dotenv').config();

// @desc Forgot password
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email, type } = req.body; // type can be 'developer' or 'company'
  try {
    const Model = type === 'developer' ? Developer : Company;
    const user = await Model.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    console.log('Reset Token:', resetToken);
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Store hashed token in DB and set expiration (e.g., 15 minutes)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('Hashed Token:', hashedToken);
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    try {
      await user.save();
      console.log('User saved successfully with resetPasswordToken and resetPasswordExpires');
      console.log(user);
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      return res.status(500).json({ message: 'Failed to save user', error: saveError.message });
    }

    // Send email
    await sendEmail(email, 'Password Reset', `Reset your password using this link: ${resetURL}. This link will expire in 15 minutes.`);
    res.status(200).json({ message: 'Password reset email sent to the user ' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};

module.exports = { forgotPassword };
