const mongoose = require('mongoose');
const CompanyJobApplications = require('../../models/companyJobApplications');
const DeveloperProfile = require('../../models/developerProfile');
const DeveloperApplications = require('../../models/developerApplications');
const Developer = require('../../models/developer');

// @desc Reject a developer's application
// @route PUT /api/company/applications/reject
const rejectAppliedDeveloper = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    // Validate developerId
    if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ message: 'Invalid developer ID' });
    }

    // Atomic update using Mongoose's `$pull` and `$push`
    await CompanyJobApplications.updateOne(
      { jobId },
      { 
        $pull: { "jobApplications.applied": developerId }, 
        $push: { "jobApplications.rejected": developerId } 
      }
    );

    await DeveloperApplications.updateOne(
      { developerId },
      { 
        $pull: { "applications.applied": jobId }, 
        $push: { "applications.rejectedByCompany": jobId } 
      }
    );

    res.status(200).json({ message: 'Developer rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting developer application', error: error.message });
  }
};

// @desc Move application to under process
// @route PUT /api/company/applications/process
const underProcessAppliedDeveloper = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ message: 'Invalid developer ID' });
    }

    await CompanyJobApplications.updateOne(
      { jobId },
      { 
        $pull: { "jobApplications.applied": developerId }, 
        $push: { "jobApplications.underProcess": developerId } 
      }
    );

    await DeveloperApplications.updateOne(
      { developerId },
      { 
        $pull: { "applications.applied": jobId }, 
        $push: { "applications.underProcess": jobId } 
      }
    );

    res.status(200).json({ message: 'Developer application moved to under process' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing developer application', error: error.message });
  }
};

// @desc Hire a developer
// @route PUT /api/company/applications/hire
const hireUnderProcessDeveloper = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ message: 'Invalid developer ID' });
    }

    const applications = await CompanyJobApplications.findOne({ jobId });

    if (!applications) return res.status(404).json({ message: 'Job not found' });

    // ✅ Fix: Ensure developer is in "underProcess" before hiring
    if (!applications.jobApplications.underProcess.includes(developerId)) {
      return res.status(400).json({ message: 'Developer is not in under-process state' });
    }

    await CompanyJobApplications.updateOne(
      { jobId },
      { 
        $pull: { "jobApplications.underProcess": developerId }, 
        $push: { "jobApplications.hired": developerId } 
      }
    );

    await DeveloperApplications.updateOne(
      { developerId },
      { 
        $pull: { "applications.underProcess": jobId }, 
        $push: { "applications.hired": jobId } 
      }
    );

    res.status(200).json({ message: 'Under-Process Developer hired successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error hiring developer under-process', error: error.message });
  }
};

// @desc Reject an under-process developer
// @route PUT /api/company/applications/reject-under-process
const rejectUnderProcessDeveloper = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ message: 'Invalid developer ID' });
    }

    await CompanyJobApplications.updateOne(
      { jobId },
      { 
        $pull: { "jobApplications.underProcess": developerId }, 
        $push: { "jobApplications.rejected": developerId } 
      }
    );

    await DeveloperApplications.updateOne(
      { developerId },
      { 
        $pull: { "applications.underProcess": jobId }, 
        $push: { "applications.rejectedByCompany": jobId } 
      }
    );

    res.status(200).json({ message: 'Under-Process Developer rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting under-process developer', error: error.message });
  }
};

// @desc Move a rejected developer to under process category (second chance feature)
// @route PUT /api/company/applications/move-rejected-to-under-process
const moveRejectedToUnderProcess = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(developerId)) {
      return res.status(400).json({ message: 'Invalid developer ID' });
    }

    const applications = await CompanyJobApplications.findOne({ jobId });

    if (!applications) return res.status(404).json({ message: 'Job not found' });

    // ✅ Fix: Ensure developer is not already hired
    if (applications.jobApplications.hired.includes(developerId)) {
      return res.status(400).json({ message: 'Hired developers cannot be moved back to under-process' });
    }

    await CompanyJobApplications.updateOne(
      { jobId },
      { 
        $pull: { "jobApplications.rejected": developerId }, 
        $push: { "jobApplications.underProcess": developerId } 
      }
    );

    await DeveloperApplications.updateOne(
      { developerId },
      { 
        $pull: { "applications.rejectedByCompany": jobId }, 
        $push: { "applications.underProcess": jobId } 
      }
    );

    res.status(200).json({ message: 'Rejected Developer moved to under-process successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error moving to under-process a previously rejected developer', error: error.message });
  }
};


// @desc View developer profile
// @route GET /api/company/applications/developer/:developerId
const viewDeveloperProfile = async (req, res) => {
    const { developerId } = req.params;
    const { jobId } = req.query; // Include jobId in the query to check the status
  
    try {
      // Check the developer's application status for the given job
      const application = await CompanyJobApplications.findOne({ jobId });
  
      if (!application) {
        return res.status(404).json({ message: 'Job application not found' });
      }
  
      const isUnderProcess = application.jobApplications.underProcess.includes(developerId);
      const isHired = application.jobApplications.hired.includes(developerId);
  
      // Fetch the developer's profile
      const profile = await DeveloperProfile.findOne({ developerId }).populate('developerId', '-password');
      if (!profile) {
        return res.status(404).json({ message: 'Developer profile not found' });
      }
  
      // Fetch the developer's basic information
      const developer = await Developer.findById(developerId).select('-password');
  
      // Decide which details to show based on the application status
      let responseData = {
        bio: profile.bio,
        location: profile.location,
        github: profile.github,
        portfolio: profile.portfolio,
        professionalDetails: profile.professionalDetails,
        education: profile.education,
        workExperience: profile.workExperience,
        additionalInfo: profile.additionalInfo,
        expectedStipend: profile.expectedStipend,
        workMode: profile.workMode,
        preferredLocations: profile.preferredLocations,
        languagesPreferred: profile.languagesPreferred,
      };
  
      if (isUnderProcess || isHired) {
        // Add visible details for developers in the "underProcess" or "hired" category
        responseData = {
          fullName: developer.fullName,
          email: developer.email,
          phoneNumber: developer.phoneNumber,
          profilePhoto: profile.profilePhoto,
          linkedIn: profile.linkedIn,
          college: profile.education?.[0]?.college || 'N/A',
          ...responseData,
        };
      } else {
        // Hide specific details for other statuses
        responseData = {
          fullName: 'Hidden',
          email: 'Hidden',
          phoneNumber: 'Hidden',
          profilePhoto: 'Hidden',
          linkedIn: 'Hidden',
          college: 'Hidden',
          ...responseData,
        };
      }
  
      res.status(200).json(responseData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching developer profile', error: error.message });
    }
  };

module.exports = { rejectAppliedDeveloper, underProcessAppliedDeveloper, hireUnderProcessDeveloper, rejectUnderProcessDeveloper, moveRejectedToUnderProcess, viewDeveloperProfile };
