const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  responsibilities: [{ type: String }],
  requiredSkills: [{ type: String }],
  salaryRange: { type: String },
  workMode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid'], required: true },
  location: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('JobDescriptions', jobDescriptionSchema);
