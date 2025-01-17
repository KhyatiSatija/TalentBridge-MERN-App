const mongoose = require('mongoose');

const companyJobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions', required: true },
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer', required: true },
  status: { type: String, enum: ['applied', 'under process', 'rejected', 'hired'], default: 'applied' }
}, { timestamps: true });

module.exports = mongoose.model('CompanyJobApplications', companyJobApplicationSchema);
