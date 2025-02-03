const Developer = require('../../models/developer');
const Company = require('../../models/company');
const crypto = require('crypto');

// @desc Reset password
// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { resetToken, newPassword, confirmPassword, type } = req.body;
  console.log('Reset Token:', resetToken);
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    // Hash the token to match the database record
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log('Hashed Token:', hashedToken);
    // Find the user by token and ensure it's valid
    const Model = type === 'developer' ? Developer : Company;
    const user = await Model.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });
    console.log('User:', user);
    if (!user) {
      console.log('Invalid or expired token:', { resetToken, hashedToken });
      return res.status(400).json({ message: 'Invalid or expired token. The token is valid for 15 minutes only' });
    }

    // Update the password
    user.password = newPassword;
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear the expiration
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { resetPassword };
