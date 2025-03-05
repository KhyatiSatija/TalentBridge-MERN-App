const natural = require('natural');
const { WordTokenizer, PorterStemmer, TfIdf } = natural;

const calculateMatchScore = (developerProfile, jobDescription) => {
    let matchScore = 0;
    const tokenizer = new WordTokenizer();
    const tfidf = new TfIdf();

    // Preprocessing function
    const preprocess = (text) => {
        return tokenizer.tokenize(text.toLowerCase()).map(word => PorterStemmer.stem(word));
    };

    // Skills matching with advanced NLP techniques
    const developerSkills = developerProfile.professionalDetails.skills || [];
    const jobSkills = jobDescription.requiredSkills || [];
    
    const processedDevSkills = new Set(developerSkills.map(preprocess).flat());
    const processedJobSkills = new Set(jobSkills.map(preprocess).flat());

    // Advanced skill matching
    const skillsMatchScore = jobSkills.reduce((score, jobSkill) => {
        const processedJobSkill = preprocess(jobSkill);
        
        // Exact match
        const exactMatch = processedJobSkill.some(skill => 
            processedDevSkills.has(skill)
        );
        
        // Partial match and semantic similarity
        const partialMatch = processedJobSkill.some(skill => 
            Array.from(processedDevSkills).some(devSkill => 
                devSkill.includes(skill) || skill.includes(devSkill)
            )
        );
        
        return score + (exactMatch ? 3 : (partialMatch ? 1 : 0));
    }, 0);

    matchScore += skillsMatchScore;

    // Experience level matching with more nuanced approach
    const yearsOfExperience = developerProfile.professionalDetails.yearsOfExperience || 0;
    const experienceLevelMap = {
        'Entry': { min: 0, max: 1 },
        'Junior': { min: 1, max: 3 },
        'Mid': { min: 3, max: 5 },
        'Senior': { min: 5, max: 8 },
        'Lead': { min: 8, max: 100 }
    };

    // More granular experience matching
    const jobExperienceLevel = jobDescription.experienceLevel || 'Entry';
    const experienceLevelRequirement = experienceLevelMap[jobExperienceLevel];
    
    if (yearsOfExperience >= experienceLevelRequirement.min) {
        matchScore += 2;
        if (yearsOfExperience >= experienceLevelRequirement.max) {
            matchScore += 1;
        }
    }

    // Job role and title matching
    const jobRolesInterested = developerProfile.professionalDetails.jobRolesInterested || [];
    const processedJobTitle = preprocess(jobDescription.jobTitle || '');
    const processedJobRoles = jobRolesInterested.map(preprocess).flat();

    const jobRoleMatch = processedJobRoles.some(role => 
        processedJobTitle.some(title => 
            role.includes(title) || title.includes(role)
        )
    );

    if (jobRoleMatch) {
        matchScore += 2;
    }

    // Location and work mode matching
    if (developerProfile.preferredLocations && 
        developerProfile.preferredLocations.includes(jobDescription.location)) {
        matchScore += 2;
    }

    if (developerProfile.workMode === jobDescription.workMode) {
        matchScore += 2;
    }

    // Expected stipend matching
    const expectedStipend = developerProfile.expectedStipend && 
                             developerProfile.expectedStipend.length > 0 
                             ? parseFloat(developerProfile.expectedStipend[0]) 
                             : 0;
    const salaryRange = jobDescription.salaryRange?.split('-').map(Number);
    if (salaryRange && expectedStipend) {
        if (expectedStipend >= salaryRange[0] && expectedStipend <= salaryRange[1]) {
            matchScore += 2;
        }
    }

    return matchScore;
};

const sortJobsByMatchScore = async (loggedInUserId, jobs) => {
    try {
        // Fetch developer profile
        const developerProfile = await DeveloperProfile.findOne({ 
            developerId: loggedInUserId 
        }).lean();

        if (!developerProfile) {
            console.log('Developer profile not found');
            return jobs;
        }

        // Calculate match scores for each job
        const jobsWithScores = jobs.map(job => ({
            ...job,
            matchScore: calculateMatchScore(developerProfile, job)
        }));

        // Sort jobs by match score in descending order
        return jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    } catch (error) {
        console.error('Error sorting jobs:', error);
        return jobs;
    }
};

module.exports = { sortJobsByMatchScore };