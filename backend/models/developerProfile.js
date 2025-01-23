const mongoose = require('mongoose');

const developerProfileSchema = new mongoose.Schema({
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer', required: true },
  profilePhoto: { type: String },
  bio: { type: String },
  location: { type: String },
  linkedIn: { type: String },
  github: { type: String },
  portfolio: { type: String },
  professionalDetails: {
    currentJob: { type: String },
    yearsOfExperience: { type: Number, default: 0 },
    skills: [{ type: String }],
    jobRolesInterested: [{ type: String }]
  },
  education: [
    {
      college: { type: String },
      degree: { type: String },
      graduationYear: { type: Number }
    }
  ],
  workExperience: [
    {
      company: { type: String },
      jobTitle: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      responsibilities: [{ type: String }]
    }
  ],
  additionalInfo: {
    certifications: [{ type: String }],
    achievements: [{ type: String }],
    languages: [{ type: String }]
  },
  expectedStipend: { type: Number },
  workMode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid']},
  preferredLocations: [{ type: String }],
  languagesPreferred: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('DeveloperProfile', developerProfileSchema);
