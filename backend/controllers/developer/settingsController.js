const Developer = require('../../models/developer');
const bcrypt = require('bcrypt');

// @desc Update developer email
// @route PUT /api/developer/settings/update-email
const updateEmail = async (req, res) => {
  const { newEmail } = req.body;

  try {
    const developer = await Developer.findById(req.user.id);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    developer.email = newEmail;
    await developer.save();

    res.status(200).json({ message: 'Email updated successfully', email: developer.email });
  } catch (error) {
    res.status(500).json({ message: 'Error updating email', error: error.message });
  }
};

// @desc Change developer password
// @route PUT /api/developer/settings/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const developer = await Developer.findById(req.user.id);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, developer.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update to new password
    const salt = await bcrypt.genSalt(10);
    developer.password = await bcrypt.hash(newPassword, salt);
    await developer.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// @desc Update developer phone number
// @route PUT /api/developer/settings/update-phone
const updatePhoneNumber = async (req, res) => {
  const { newPhoneNumber } = req.body;

  try {
    const developer = await Developer.findById(req.user.id);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    developer.phoneNumber = newPhoneNumber;
    await developer.save();

    res.status(200).json({ message: 'Phone number updated successfully', phoneNumber: developer.phoneNumber });
  } catch (error) {
    res.status(500).json({ message: 'Error updating phone number', error: error.message });
  }
};

// @desc Delete developer account
// @route DELETE /api/developer/settings/delete-account
const deleteAccount = async (req, res) => {
  try {
    const developer = await Developer.findByIdAndDelete(req.user.id);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

module.exports = { updateEmail, changePassword, updatePhoneNumber, deleteAccount };
