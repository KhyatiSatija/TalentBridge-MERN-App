const Company = require('../../models/company');
const bcrypt = require('bcrypt');
const CompanyJobApplications = require("../../models/companyJobApplications");
const DeveloperApplications = require("../../models/developerApplications");
const JobDescriptions = require("../../models/jobDescriptions");

// @desc Update company email
// @route PUT /api/company/settings/update-email
const updateEmail = async (req, res) => {
  const { newEmail } = req.body;

  try {
    const companyId = req.headers['companyid'];
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if the email format is valid using the regex validator
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (company.email === newEmail){
      return res.status(400).json({message : "New Email can't be the same as the current email!"});
    }
    const existingCompany = await Company.findOne({email : newEmail});
    if (existingCompany){
      return res.status(400).json({message : "An account with this email already exists!!"});
    }
    //update the email
    const updatedCompany = await Company.findIdAndUpdate(
      companyId,
      { email : newEmail },
      { new: true, runValidators: true }
    );
    if(!updatedCompany){
      return res.status(500).json({ message : "Error updating email"});
    }

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
    const companyId = req.headers['companyid'];
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
    const companyId = req.headers['companyid']; 
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    // Find company
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Find and delete all job descriptions posted by the company
    const jobs = await JobDescriptions.find({ companyId });
    const jobIds = jobs.map(job => job._id);

    await JobDescriptions.deleteMany({ companyId });

    // Delete all job applications received for jobs posted by the company
    await CompanyJobApplications.deleteMany({ jobId: { $in: jobIds } });

    // Remove the company ID from all developer application records
    await DeveloperApplications.updateMany(
      {},
      {
        $pull: {
          'applications.rejected': { $in: jobIds },
          'applications.applied': { $in: jobIds },
          'applications.underProcess': { $in: jobIds },
          'applications.hired': { $in: jobIds },
          'applications.underHold': { $in: jobIds },
          'applications.rejectedByCompany': { $in: jobIds },
        },
      }
    );

    // Finally, delete the company itself
    await Company.findByIdAndDelete(companyId);

    res.status(200).json({ message: 'Company account and associated data deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

// @desc Change company name
// @route PUT /api/company/settings/change-name
const changeName = async (req, res) => {
  const { newName } = req.body;

  try {
    const companyId = req.headers['companyid'];
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
