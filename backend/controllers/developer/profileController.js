const Developer = require('../../models/developer');
const DeveloperProfile = require('../../models/developerProfile');

// @desc Fetch developer profile
// @route GET /api/developer/profile
const getProfile = async (req, res) => {
    try {
      // Find the developer's profile by developerId
      const loggedInUser = req.headers["developer-id"] ;
      let profile = await DeveloperProfile.findOne({ developerId: loggedInUser });
  
      if (!profile) {
        // Initialize a new profile if one doesn't exist
        profile = new DeveloperProfile({
          developerId: loggedInUser, // Associate with the logged-in developer
          bio: "Add your bio here", // Placeholder data for new profiles
          professionalDetails: { skills: [], jobRolesInterested: [] },
          education: [],
          workExperience: [],
          additionalInfo: {
            certifications: [],
            achievements: [],
            languages: [],
          },
          preferredLocations: [],
          languagesPreferred: [],
        });
        await profile.save();
      }
  
      // Combine fullName from Developer with the rest of the DeveloperProfile details
      const developer = await Developer.findById(loggedInUser, 'fullName');
      if (!developer) {
        return res.status(404).json({ message: 'Developer not found' });
      }
  
      const combinedProfile = {
        fullName: developer.fullName,
        ...profile.toObject(),
      };
  
      res.status(200).json(combinedProfile);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
  };
  

// @desc Update developer profile
// @route PUT /api/developer/profile
const updateProfile = async (req, res) => {
    try {
      const loggedInUser =req.headers["developer-id"] ; // Retrieve the logged-in user's ID
      const updates = req.body; // Fields to update sent by the frontend
  
      // Define allowed fields for updating
      const allowedFields = [
        'fullName', // From Developer schema
        'profilePhoto', // From DeveloperProfile schema
        'bio',
        'location',
        'linkedIn',
        'github',
        'portfolio',
        'professionalDetails.currentJob',
        'professionalDetails.yearsOfExperience',
        'professionalDetails.skills',
        'professionalDetails.jobRolesInterested',
        'education',
        'workExperience',
        'additionalInfo.certifications',
        'additionalInfo.achievements',
        'additionalInfo.languages',
        'expectedStipend',
        'workMode',
        'preferredLocations',
        'languagesPreferred',
      ];
  
      // Filter updates to ensure only allowed fields are processed
      const filteredUpdates = {};
      Object.keys(updates).forEach((key) => {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = updates[key];
        }
      });
  
      if (Object.keys(filteredUpdates).length === 0) {
        return res.status(400).json({ message: 'No valid fields provided for update' });
      }
  
      // Update `fullName` if provided
      if (filteredUpdates.fullName) {
        await Developer.findByIdAndUpdate(
          loggedInUser,
          { fullName: filteredUpdates.fullName },
          { new: true, runValidators: true }
        );
        delete filteredUpdates.fullName; // Remove fullName to avoid duplicate processing
      }
  
      // Check if DeveloperProfile exists; if not, initialize a new one
      let profile = await DeveloperProfile.findOne({ developerId: loggedInUser });
  
      if (!profile) {
        profile = new DeveloperProfile({ developerId: loggedInUser }); // Create a new profile
        await profile.save();
      }
  
      // Update the profile with the remaining filtered fields
      const updatedProfile = await DeveloperProfile.findOneAndUpdate(
        { developerId: loggedInUser },
        { $set: filteredUpdates },
        { new: true, runValidators: true }
      );
  
      res.status(200).json({ message: 'Profile updated successfully', profile: updatedProfile });
    } catch (error) {
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };
  
  module.exports = { getProfile, updateProfile };
  