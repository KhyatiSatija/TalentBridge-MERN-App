const mongoose = require('mongoose');

const companyJobApplicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions', required: true },
  jobApplications: {
    rejected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }], // Developers rejected by the company
    applied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }],  // Developers who applied
    underProcess: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }], // Developers being considered
    hired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Developer' }], // Developers hired
  },
}, 
  { timestamps: true }
);
module.exports = mongoose.model('CompanyJobApplications', companyJobApplicationSchema);
