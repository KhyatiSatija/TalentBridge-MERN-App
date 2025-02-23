const Developer = require('../../models/developer');
const DeveloperProfile = require('../../models/developerProfile');
const multer = require("multer");
const path = require("path");

// Multer Configuration for Handling Profile Photo Uploads
const storage = multer.diskStorage({
  destination: "./uploads/profilePhotos/",
  filename: (req, file, cb) => {
    cb(null, req.headers["developer-id"] + path.extname(file.originalname)); // Use developer ID as filename
  },
});


const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer
const upload = multer({ storage, fileFilter });


// Upload Profile Photo
// @route PUT /api/developer/uploadProfilePhoto

const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const imagePath = `/uploads/profilePhotos/${req.file.filename}`;

    //  Update the developer's profile photo
    const updatedProfile = await DeveloperProfile.findOneAndUpdate(
      { developerId: req.headers["developer-id"] },
      { profilePhoto: imagePath },
      { new: true }
    );

    res.status(200).json({ message: "Profile photo updated successfully", profilePhoto: imagePath });
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile photo", error: error.message });
  }
};
// @desc Fetch developer profile
// @route GET /api/developer/profile
const getProfile = async (req, res) => {
    try {
      // Find the developer's profile by developerId
      const loggedInUser = req.headers["developer-id"] ;
      if (!loggedInUser) {
        return res.status(400).json({ message: "Developer ID missing from headers" });
      }
      let profile = await DeveloperProfile.findOne({ developerId: loggedInUser });
  
      if (!profile) {
        // Initialize a new profile if one doesn't exist
        profile = new DeveloperProfile({
          developerId: loggedInUser, // Associate with the logged-in developer
          profilePhoto: "",
          bio: "", 
          location: "",
          linkedIn: "",
          github: "",
          portfolio: "",

          professionalDetails: {
            currentJob: "",
            yearsOfExperience: 0,
            skills: [],  // Ensuring proper array initialization
            jobRolesInterested: []
          },
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
      if (!loggedInUser) {
        return res.status(400).json({ message: "Developer ID missing from headers" });
      }
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
        'professionalDetails',
        'education',
        'workExperience',
        'additionalInfo',
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
      console.log("Filtered Updates ", filteredUpdates);

      // Check if DeveloperProfile exists; if not, initialize a new one
      let profile = await DeveloperProfile.findOne({ developerId: loggedInUser })
      if (!profile) {
        profile = new DeveloperProfile({ developerId: loggedInUser }); // Create a new profile
        await profile.save();
      }
      
      

      if (updates.education) {
        if (Array.isArray(updates.education)) {
            profile.education = updates.education;  // Replace the whole array
        } else {
            profile.education = [updates.education]; // Ensure it's wrapped in an array
        }
      }

      if (updates.preferredLocations) {
        if (Array.isArray(updates.preferredLocations)) {
            profile.preferredLocations = updates.preferredLocations;
        } else if (typeof updates.preferredLocations === "string") {
            profile.preferredLocations = [updates.preferredLocations]; // Convert string to array
        } else {
            console.error("❌ Invalid preferredLocations format:", updates.preferredLocations);
            return res.status(400).json({ message: "`preferredLocations` must be an array of strings" });
        }
      }

      if (updates.languagesPreferred) {
          if (Array.isArray(updates.languagesPreferred)) {
              profile.languagesPreferred = updates.languagesPreferred;
          } else if (typeof updates.languagesPreferred === "string") {
              profile.languagesPreferred = [updates.languagesPreferred];
          } else {
              console.error(" Invalid languagesPreferred format:", updates.languagesPreferred);
              return res.status(400).json({ message: "`languagesPreferred` must be an array of strings" });
          }
      }

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

  

      Object.keys(filteredUpdates).forEach((key) => {
        if (!["education", "preferredLocations", "languagesPreferred"].includes(key)) {
          if (typeof filteredUpdates[key] === "object" && !Array.isArray(filteredUpdates[key])) {
            profile[key] = { ...profile[key], ...filteredUpdates[key] };
          } else {
            profile[key] = filteredUpdates[key]; 
          }
        }
      });

      await profile.save();
      // const updatedProfile = await DeveloperProfile.findOne({ developerId: loggedInUser });

      // console.log("Updated Profile ", updatedProfile);

      res.status(200).json({ message: 'Profile updated successfully', profile: profile });
      
    } catch (error) {
      console.error("Backend Error: ", error); 
      res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
  };
  
  module.exports = { upload, uploadProfilePhoto, getProfile, updateProfile };
  