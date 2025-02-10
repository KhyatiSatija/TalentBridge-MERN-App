const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  responsibilities: [{ type: String }], //array of strings
  requiredSkills: [{ type: String }],
  salaryRange: { type: String },
  workMode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid'] },
  location: { type: String },
  lastDateToApply: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('JobDescriptions', jobDescriptionSchema);
