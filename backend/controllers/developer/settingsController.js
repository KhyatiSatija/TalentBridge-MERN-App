const Developer = require('../../models/developer');
const bcrypt = require('bcrypt');
const DeveloperProfile = require("../../models/developerProfile");
const DeveloperApplications = require("../../models/developerApplications");
const DeveloperConnections = require("../../models/developerConnections");
const CompanyJobApplications = require("../../models/companyJobApplications");

// @desc Update developer email
// @route PUT /api/developer/settings/update-email
const updateEmail = async (req, res) => {
  const { newEmail } = req.body;
  const loggedInDeveloperId = req.headers["developer-id"];
  
  if (!loggedInDeveloperId) {
    return res.status(401).json({ message: "Developer ID is required" });
  }
  
  try {
    // Check if the email is provided
    if (!newEmail) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Check if the email format is valid using the regex validator
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    const developer = await Developer.findById(loggedInDeveloperId);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    if (developer.email === newEmail){
      return res.status(400).json({message: "New email can't be the same as the current email"});
    }

    // Check if the new email is already taken
    const existingDeveloper = await Developer.findOne({ email: newEmail });
    if (existingDeveloper) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }
    
    // Update the email
    const updatedDeveloper = await Developer.findByIdAndUpdate(
      loggedInDeveloperId,
      { email: newEmail },
      { new: true, runValidators: true }
    );

    if (!updatedDeveloper) {
      return res.status(500).json({ message: "Error updating email" });
    }

    res.status(200).json({ message: 'Email updated successfully', email: updatedDeveloper.email });
  } catch (error) {
    console.error("Error updating email:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid developer ID format' });
    }
    res.status(500).json({ message: 'Error updating email', error: error.message });
  }
};

// @desc Change developer password
// @route PUT /api/developer/settings/change-password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const loggedInDeveloperId = req.headers["developer-id"];
  
  if (!loggedInDeveloperId) {
    return res.status(401).json({ message: "Developer ID is required" });
  }
  
  try {
    // Check if both passwords are provided
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }
    
    // Check if new password meets minimum length requirement
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }
    
    const developer = await Developer.findById(loggedInDeveloperId);
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
    console.error("Error changing password:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid developer ID format' });
    }
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// @desc Update developer phone number
// @route PUT /api/developer/settings/update-phone
const updatePhoneNumber = async (req, res) => {
  const { newPhoneNumber } = req.body;
  const loggedInDeveloperId = req.headers["developer-id"];
  
  if (!loggedInDeveloperId) {
    return res.status(401).json({ message: "Developer ID is required" });
  }
  
  try {
    // Check if phone number is provided
    if (!newPhoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    
    const developer = await Developer.findById(loggedInDeveloperId);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }
    
    // Validate phone number format (10 digits)
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(newPhoneNumber)){
      return res.status(400).json({message: "Please enter a valid 10 digit phone number"});
    }

    if (developer.phoneNumber === newPhoneNumber){
      return res.status(400).json({message: "New phone number can't be the same as the current one"});
    }
    
    const existingDeveloper = await Developer.findOne({phoneNumber: newPhoneNumber});
    if (existingDeveloper){
      return res.status(400).json({message: "An account with this phone number already exists"});
    }

    const updatedDeveloper = await Developer.findByIdAndUpdate(
      loggedInDeveloperId,
      {phoneNumber: newPhoneNumber},
      {new: true, runValidators: true}
    );
    
    if (!updatedDeveloper){
      return res.status(500).json({message: "Error updating the phone number"});
    }

    res.status(200).json({ message: 'Phone number updated successfully', phoneNumber: updatedDeveloper.phoneNumber });
  } catch (error) {
    console.error("Error updating phone number:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid developer ID format' });
    }
    res.status(500).json({ message: 'Error updating phone number', error: error.message });
  }
};

// @desc Delete developer account
// @route DELETE /api/developer/settings/delete-account
const deleteAccount = async (req, res) => {
  const loggedInDeveloperId = req.headers["developer-id"];
  
  if (!loggedInDeveloperId) {
    return res.status(401).json({ message: "Developer ID is required" });
  }
  
  try {
    const developer = await Developer.findById(loggedInDeveloperId);
    if (!developer) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    // Delete all associated data
    await Promise.all([
      DeveloperProfile.deleteOne({developerId: loggedInDeveloperId}),
      DeveloperApplications.deleteOne({developerId: loggedInDeveloperId}),
      DeveloperConnections.deleteOne({developerId: loggedInDeveloperId}),
      
      // Update references in other collections
      DeveloperConnections.updateMany(
        {
          $or: [
            { "connections.rejected": loggedInDeveloperId },
            { "connections.requested": loggedInDeveloperId },
            { "connections.matched": loggedInDeveloperId },
            { "connections.connectionRequests": loggedInDeveloperId },
          ]
        },
        {
          $pull: {
            "connections.rejected": loggedInDeveloperId,
            "connections.requested": loggedInDeveloperId,
            "connections.matched": loggedInDeveloperId,
            "connections.connectionRequests": loggedInDeveloperId,
          }
        }
      ),
      
      CompanyJobApplications.updateMany(
        { 
          $or: [
            { "jobApplications.rejected": loggedInDeveloperId },
            { "jobApplications.applied": loggedInDeveloperId },
            { "jobApplications.underProcess": loggedInDeveloperId },
            { "jobApplications.hired": loggedInDeveloperId },
          ] 
        },
        { 
          $pull: {
            "jobApplications.rejected": loggedInDeveloperId,
            "jobApplications.applied": loggedInDeveloperId,
            "jobApplications.underProcess": loggedInDeveloperId,
            "jobApplications.hired": loggedInDeveloperId,
          } 
        }
      ),
      
      Developer.findByIdAndDelete(loggedInDeveloperId)
    ]);

    res.status(200).json({ message: 'Account and all associated data deleted successfully' });
  } catch (error) {
    console.error("Error deleting account:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid developer ID format' });
    }
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

module.exports = { updateEmail, changePassword, updatePhoneNumber, deleteAccount };