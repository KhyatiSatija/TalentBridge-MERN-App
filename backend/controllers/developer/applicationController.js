const DeveloperApplications = require('../../models/developerApplications');
const CompanyJobApplications = require('../../models/companyJobApplications');
const JobDescriptions = require('../../models/jobDescriptions');
const Company = require('../../models/company');

// @desc Get all job applications for the logged-in developer
// @route GET /api/developer/applications
const getDeveloperApplications = async (req, res) => {
    try {
      const loggedInUserId = req.headers["developer-id"];
  
      // Fetch developer applications
      const developerApplications = await DeveloperApplications.findOne({ developerId: loggedInUserId }).lean();
  
      if (!developerApplications) {
        // If no applications found, return an empty response
        res.status(200).json({
            onHoldApplications,
            rejectedApplications,
            appliedApplications,
            underProcessApplications,
            hiredApplications,
          });
      }

    // Helper function to fetch job details without company name
    const fetchJobDetailsWithoutCompanyName = async (jobIds) => {
      return await JobDescriptions.find({
        _id: { $in: jobIds },
      })
      .select("-companyId") // Exclude companyId field
      .lean();
    };
  
    // Helper function to fetch job details and resolve company name
    const fetchJobDetailsWithCompanyName = async (jobIds) => {
        const jobs = await JobDescriptions.find({
           _id: { $in: jobIds },
        }).lean();
  
        // Map job details and fetch company names
        return Promise.all(
          jobs.map(async (job) => {
            const company = await Company.findById(job.companyId).select('name').lean();
            return {
                companyName: company ? company.name : null,
                jobId: job._id,
                jobTitle: job.jobTitle,
                jobDescription: job.jobDescription,
                responsibilities: job.responsibilities,
                requiredSkills: job.requiredSkills,
                salaryRange: job.salaryRange,
                workMode: job.workMode,
                location: job.location,
                lastDateToApply: job.lastDateToApply, 
                acceptingApplications : job.acceptingApplication
            };
          })
        );
      };
  
      // Fetch onHold applications (no company name required)
      const onHoldApplications = await fetchJobDetailsWithoutCompanyName(developerApplications.applications.underHold);
  
      // Fetch rejected applications (no company name required)
      const rejectedApplications = await fetchJobDetailsWithoutCompanyName(developerApplications.applications.rejected);
  
      // Fetch applied applications with company name
      const appliedApplications = await fetchJobDetailsWithoutCompanyName(developerApplications.applications.applied);
  
      // Fetch underProcess applications with company name
      const underProcessApplications = await fetchJobDetailsWithCompanyName(developerApplications.applications.underProcess);
  
      // Fetch hired applications with company name
      const hiredApplications = await fetchJobDetailsWithCompanyName(developerApplications.applications.hired);
  
    res.status(200).json({
      onHoldApplications,
      rejectedApplications,
      appliedApplications,
      underProcessApplications,
      hiredApplications,
    });
    } catch (error) {
      console.error('Error fetching developer applications:', error.message);
      res.status(500).json({ message: 'Error fetching developer applications', error: error.message });
    }
  };
  

// @desc Update developer applications
// @route PUT /api/developer/applications
const updateDeveloperApplications = async (req, res) => {
    const { jobId, action } = req.body; // action = 'reject', 'apply', 'delete'
    const loggedInUserId = req.headers["developer-id"];
  
    try {
      console.log("job ID", jobId);
      // Fetch developer application data
      let developerApplications = await DeveloperApplications.findOne({ developerId: loggedInUserId });
  
      if (!developerApplications) {
        return res.status(404).json({ message: 'No application data found for the logged-in user' });
      }
      console.log("developer Applications",developerApplications);
  
      // Fetch the job details
      const job = await JobDescriptions.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      console.log("job", job);
      const currentDate = new Date();
  
      // If job ID is in onHold list and action is 'reject'
      if (developerApplications.applications.underHold.includes(jobId) && action === 'reject') {
        if (currentDate > job.lastDateToApply) {
          return res.status(400).json({ message: 'Cannot reject the job. Application deadline has passed.' });
        }
        
        developerApplications.applications.underHold = developerApplications.applications.underHold.filter(
          (id) => id.toString() !== jobId.toString()
        );
        developerApplications.applications.rejected.push(jobId);
  
      // If job ID is in onHold list and action is 'apply'
      } else if (developerApplications.applications.underHold.includes(jobId) && action === 'apply') {
        if (currentDate > job.lastDateToApply) {
          return res.status(400).json({ message: 'Cannot apply to the job. Application deadline has passed.' });
        }
        if (!job.acceptingApplications) {
          return res.status(400).json({ message: 'Cannot apply to the job. Applications are closed.' });
        }
  
        developerApplications.applications.underHold = developerApplications.applications.underHold.filter(
          (id) => id.toString() !== jobId.toString()
        );
        developerApplications.applications.applied.push(jobId);
  
        // Update the company job applications
        const companyJobApplications = await CompanyJobApplications.findOne({ jobId });
  
        if (companyJobApplications) {
          if (!companyJobApplications.jobApplications.applied.includes(loggedInUserId)) {
            companyJobApplications.jobApplications.applied.push(loggedInUserId);
          }
          await companyJobApplications.save();
        }
  
      // If job ID is in onHold list and action is 'delete'
      } else if (developerApplications.applications.underHold.includes(jobId) && action === 'delete') {
        developerApplications.applications.underHold = developerApplications.applications.underHold.filter(
          (id) => id.toString() !== jobId.toString()
        );
  
      // If job ID is in rejected list and action is 'delete'
      } else if (developerApplications.applications.rejected.includes(jobId) && action === 'delete') {
        developerApplications.applications.rejected = developerApplications.applications.rejected.filter(
          (id) => id.toString() !== jobId.toString()
        );
  
      // If job ID is in rejected list and action is 'apply'
      } else if (developerApplications.applications.rejected.includes(jobId) && action === 'apply') {
        if (currentDate > job.lastDateToApply) {
          return res.status(400).json({ message: 'Cannot reapply to the job. Application deadline has passed.' });
        }
        if (!job.acceptingApplications) {
          return res.status(400).json({ message: 'Cannot reapply to the job. Applications are closed.' });
        }
  
        developerApplications.applications.rejected = developerApplications.applications.rejected.filter(
          (id) => id.toString() !== jobId.toString()
        );
        developerApplications.applications.applied.push(jobId);
  
        // Update the company job applications
        const companyJobApplications = await CompanyJobApplications.findOne({ jobId });
  
        if (companyJobApplications) {
          if (!companyJobApplications.jobApplications.applied.includes(loggedInUserId)) {
            companyJobApplications.jobApplications.applied.push(loggedInUserId);
          }
          await companyJobApplications.save();
        }
      // if jobID is in Applied and action is "reject"
      } else if (developerApplications.applications.applied.includes(jobId)  && action === "reject"){
        //update developerApplications
        developerApplications.applications.applied = developerApplications.applications.applied.filter(
          (id) => id.toString() !==  jobId.toString()
        );

        developerApplications.applications.rejected.push(jobId);
        
        //update CompanyJobApplications
        const companyJobApplications = await CompanyJobApplications.findOne({ jobId });

        if (companyJobApplications){
          companyJobApplications.jobApplications.applied = companyJobApplications.jobApplications.applied.filter(
            (id) => id.toString() !== loggedInUserId.toString()
          );
          await companyJobApplications.save();
        } 
      } 
      // if jobId is in underProcess and action is "reject"
      else if (developerApplications.applications.underProcess.includes(jobId)  && action === "reject"){
        //update developerApplications
        developerApplications.applications.underProcess = developerApplications.applications.underProcess.filter(
          (id) => id.toString() !==  jobId.toString()
        );

        developerApplications.applications.rejected.push(jobId);

        await developerApplications.save();
        
        //update CompanyJobApplications
        const companyJobApplications = await CompanyJobApplications.findOne({ jobId });

        if (companyJobApplications){
          companyJobApplications.jobApplications.underProcess = companyJobApplications.jobApplications.underProcess.filter(
            (id) => id.toString() !== loggedInUserId.toString()
          );
          await companyJobApplications.save();
        } 
      } 
      
      // if jobId is in hired and action is "reject"
      else if (developerApplications.applications.hired.includes(jobId)  && action === "reject"){
        //update developerApplications
        developerApplications.applications.hired = developerApplications.applications.hired.filter(
          (id) => id.toString() !==  jobId.toString()
        );

        developerApplications.applications.rejected.push(jobId);

        await developerApplications.save();
        
        //update CompanyJobApplications
        const companyJobApplications = await CompanyJobApplications.findOne({ jobId });

        if (companyJobApplications){
          companyJobApplications.jobApplications.hired = companyJobApplications.jobApplications.hired.filter(
            (id) => id.toString() !== loggedInUserId.toString()
          );
          await companyJobApplications.save();
        } 
      }
      else {
        return res.status(400).json({ message: 'Invalid action or job ID does not belong to the specified list.' });
      }
      // Save the updated developer application data
      await developerApplications.save();
  
      res.status(200).json({ message: 'Job application updated successfully' });
    } catch (error) {
      console.error('Error updating developer applications:', error.message);
      res.status(500).json({ message: 'Error updating developer applications', error: error.message });
    }
  };
  

module.exports = { getDeveloperApplications, updateDeveloperApplications };
