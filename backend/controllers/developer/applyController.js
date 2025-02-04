const DeveloperApplications = require('../../models/developerApplications');
const CompanyJobApplications = require('../../models/companyJobApplications');
const JobDescriptions = require('../../models/jobDescriptions');

// @desc Fetch job cards
// @route GET /api/developer/jobs
const getJobCards = async (req, res) => {
  try {
    // const loggedInUserId = req.user.id;
    const loggedInUserId = req.headers["developer-id"];
    // Fetch developer application data
    let developerApplications = await DeveloperApplications.findOne({ developerId: loggedInUserId }).lean();

    // If developer application data doesn't exist, initialize it
    if (!developerApplications) {
        console.log('No application data found for the logged-in user. Initializing...');
        await DeveloperApplications.create({
            developerId: loggedInUserId,
            applications: {
            rejected: [],
            applied: [],
            underProcess: [],
            hired: [],
            underHold: [],
            rejectedByCompany: [],
            },
        });
    }

    // Create a set of excluded job IDs
    const excludedJobIds = new Set([
      ...developerApplications.applications.rejected,
      ...developerApplications.applications.applied,
      ...developerApplications.applications.underProcess,
      ...developerApplications.applications.hired,
      ...developerApplications.applications.underHold,
      ...developerApplications.applications.rejectedByCompany,
    ]);

    const currentDate = new Date();


    // Fetch job descriptions not in the excluded list
    const jobs = await JobDescriptions.find({
      _id: { $nin: Array.from(excludedJobIds) },
      lastDateToApply: { $gte: currentDate } 
    })
      .select('jobTitle jobDescription responsibilities requiredSkills salaryRange workMode location lastDateToApply') 
      .lean();

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching job cards:', error.message);
    res.status(500).json({ message: 'Error fetching job cards', error: error.message });
  }
};

// @desc Record swipe action
// @route POST /api/developer/jobs
const swipeOnJob = async (req, res) => {
  const { jobId, action } = req.body; // `jobId` is the target job's ID, `action` is 'swipeRight' or 'swipeLeft' or 'underHold'

  try {
    // const loggedInUserId = req.user.id;
    const loggedInUserId = req.headers["developer-id"];
    // Fetch developer application data
    let developerApplications = await DeveloperApplications.findOne({ developerId: loggedInUserId });

    // If developer application data doesn't exist, initialize it
    if (!developerApplications) {
      developerApplications = await DeveloperApplications.create({
        developerId: loggedInUserId,
        applications: {
          rejected: [],
          applied: [],
          underProcess: [],
          hired: [],
          underHold: [],
          rejectedByCompany: [],
        },
      });
    }

    // Fetch job application data for the given jobId
    let jobApplications = await CompanyJobApplications.findOne({ jobId });

    // If job application data doesn't exist, initialize it
    if (!jobApplications) {
      jobApplications = await CompanyJobApplications.create({
        jobId,
        jobApplications: {
          rejected: [],
          applied: [],
          underProcess: [],
          hired: [],
        },
      });
    }

    if (action === 'swipeLeft') {
      // Add jobId to the rejected list for the developer
      if (!developerApplications.applications.rejected.includes(jobId)) {
        developerApplications.applications.rejected.push(jobId);
      }
    } else if (action === 'swipeRight') {
      // Add jobId to the applied list for the developer
      if (!developerApplications.applications.applied.includes(jobId)) {
        developerApplications.applications.applied.push(jobId);
      }

      // Add loggedInUserId to the applied list for the job
      if (!jobApplications.jobApplications.applied.includes(loggedInUserId)) {
        jobApplications.jobApplications.applied.push(loggedInUserId);
      }
    } else if (action === 'underHold') {
        // Add jobId to the underHold list for the developer
        if (!developerApplications.applications.underHold.includes(jobId)) {
            developerApplications.applications.underHold.push(jobId);
        }
    }


    // Save the updated documents(schema)
    await developerApplications.save();
    await jobApplications.save();

    res.status(200).json({ message: 'Swipe action recorded successfully' });
  } catch (error) {
    console.error('Error recording swipe action:', error.message);
    res.status(500).json({ message: 'Error recording swipe action', error: error.message });
  }
};

module.exports = { getJobCards, swipeOnJob };
