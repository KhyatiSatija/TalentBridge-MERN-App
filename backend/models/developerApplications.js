const mongoose = require('mongoose');

const developerApplicationSchema = new mongoose.Schema({
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions', required: true },
  status: { type: String, enum: ['applied', 'under process', 'rejected', 'hired'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('DeveloperApplications', developerApplicationSchema);
