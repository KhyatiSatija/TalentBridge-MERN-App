const Company = require('../../models/company');
const bcrypt = require('bcrypt');

// @desc Update company email
// @route PUT /api/company/settings/update-email
const updateEmail = async (req, res) => {
  const { newEmail } = req.body;

  try {
    const companyId = req.headers['companyId'];
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.email = newEmail;
    await company.save();

    res.status(200).json({ message: 'Email updated successfully', email: company.email });
  } catch (error) {
    res.status(500).json({ message: 'Error updating email', error: error.message });
  }
};

// @desc Update company password
// @route PUT /api/company/settings/update-password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const companyId = req.headers['companyId'];
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, company.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update to new password
    const salt = await bcrypt.genSalt(10);
    company.password = await bcrypt.hash(newPassword, salt);
    await company.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error: error.message });
  }
};

// @desc Delete company account
// @route DELETE /api/company/settings/delete-account
const deleteAccount = async (req, res) => {
  try {
    const companyId = req.headers['companyId'];
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

// @desc Change company name
// @route PUT /api/company/settings/change-name
const changeName = async (req, res) => {
  const { newName } = req.body;

  try {
    const companyId = req.headers['companyId'];
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.name = newName;
    await company.save();

    res.status(200).json({ message: 'Company Name changed successfully', name: company.name });
  } catch (error) {
    res.status(500).json({ message: 'Error changing name', error: error.message });
  }
};

module.exports = { updateEmail, updatePassword, deleteAccount, changeName };
