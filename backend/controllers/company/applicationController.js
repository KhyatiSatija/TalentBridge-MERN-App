const CompanyJobApplications = require('../../models/companyJobApplications');
const DeveloperProfile = require('../../models/developerProfile');
const DeveloperApplications = require('../../models/developerApplications');
const Developer = require('../../models/developer');

// @desc Reject a developer's application
// @route PUT /api/company/applications/reject
const rejectAppliedDeveloper = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    const applications = await CompanyJobApplications.findOne({ jobId });
    if (!applications) return res.status(404).json({ message: 'Job not found' });

    applications.jobApplications.applied = applications.jobApplications.applied.filter(id => id.toString() !== developerId);
    applications.jobApplications.rejected.push(developerId);

    const developerApplications = await DeveloperApplications.findOne({ developerId });
    if (!developerApplications) return res.status(404).json({ message: 'Developer not found' });

    developerApplications.applications.applied = developerApplications.applications.applied.filter(id => id.toString() !== jobId);
    developerApplications.applications.rejectedByCompany.push(jobId);

    await applications.save();
    await developerApplications.save();
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
    const applications = await CompanyJobApplications.findOne({ jobId });
    if (!applications) return res.status(404).json({ message: 'Job not found' });

    applications.jobApplications.applied = applications.jobApplications.applied.filter(id => id.toString() !== developerId);
    applications.jobApplications.underProcess.push(developerId);

    const developerApplications = await DeveloperApplications.findOne({ developerId });
    if (!developerApplications) return res.status(404).json({ message: 'Developer not found' });

    developerApplications.applications.applied = developerApplications.applications.applied.filter(id => id.toString() !== jobId);
    developerApplications.applications.underProcess.push(jobId);

    await applications.save();
    await developerApplications.save();

    res.status(200).json({ message: 'Developer Application moved to under process' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing developer application', error: error.message });
  }
};

// @desc Hire a developer
// @route PUT /api/company/applications/hire
const hireUnderProcessDeveloper = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    const applications = await CompanyJobApplications.findOne({ jobId });
    if (!applications) return res.status(404).json({ message: 'Job not found' });

    applications.jobApplications.underProcess = applications.jobApplications.underProcess.filter(id => id.toString() !== developerId);
    applications.jobApplications.hired.push(developerId);

    const developerApplications = await DeveloperApplications.findOne({ developerId });
    if (!developerApplications) return res.status(404).json({ message: 'Developer not found' });
    developerApplications.applications.underProcess = developerApplications.applications.underProcess.filter(id => id.toString() !== jobId);    
    developerApplications.applications.hired.push(jobId);

    await applications.save();
    await developerApplications.save();

    res.status(200).json({ message: 'Under-Process Developer hired successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error hiring developer under-process', error: error.message });
  }
};

// @desc reject an under process developer
// @route PUT /api/company/applications/reject-under-process
const rejectUnderProcessDeveloper = async (req, res) => {
  const { jobId, developerId } = req.body;

  try {
    const applications = await CompanyJobApplications.findOne({ jobId });
    if (!applications) return res.status(404).json({ message: 'Job not found' });
    applications.jobApplications.underProcess = applications.jobApplications.underProcess.filter(id => id.toString() !== developerId);
    applications.jobApplications.rejected.push(developerId);

    const developerApplications = await DeveloperApplications.findOne({ developerId });
    if (!developerApplications) return res.status(404).json({ message: 'Developer not found' });
    developerApplications.applications.underProcess = developerApplications.applications.underProcess.filter(id => id.toString() !== jobId);
    developerApplications.applications.rejectedByCompany.push(jobId);

    await applications.save();
    await developerApplications.save();
    res.status(200).json({ message: 'Under-Process Developer rejected successfully' });
    }
    catch( error){
        res.status(500).json({ message: 'Error rejecting under-process developer', error: error.message });
    }
};

// @desc move a rejected developer to under process category (second chances do exist !!)
// @route PUT /api/company/applications/move-rejected-to-under-process
const moveRejectedToUnderProcess = async (req, res) => {
    const { jobId, developerId } = req.body;
  
    try {
      const applications = await CompanyJobApplications.findOne({ jobId });
      if (!applications) return res.status(404).json({ message: 'Job not found' });
      applications.jobApplications.rejected = applications.jobApplications.rejected.filter(id => id.toString() !== developerId);
      applications.jobApplications.underProcess.push(developerId);
  
      const developerApplications = await DeveloperApplications.findOne({ developerId });
      if (!developerApplications) return res.status(404).json({ message: 'Developer not found' });
      developerApplications.applications.rejectedByCompany = developerApplications.applications.rejectedByCompany.filter(id => id.toString() !== jobId);
      developerApplications.applications.underProcess.push(jobId);
  
      await applications.save();
      await developerApplications.save();
      res.status(200).json({ message: 'Rejected Developer moved to under-process successfully' });
      }
      catch( error){
          res.status(500).json({ message: 'Error moving to under-process a previously rejected  developer', error: error.message });
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
