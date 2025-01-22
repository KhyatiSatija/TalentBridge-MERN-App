const mongoose = require('mongoose');

const developerApplicationSchema = new mongoose.Schema(
  {
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer', required: true },
  applications: {
    rejected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions' }], // Jobs they swiped left on
    applied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions' }],  // Jobs they applied to
    underProcess: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions' }], // Jobs they are being considered for
    hired: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions' }], // Jobs they were hired for
    underHold: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions' }], // Jobs put under review as coudnt decide if  want to apply or reject
    rejectedByCompany: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobDescriptions' }], // Jobs they were rejected by the company
  },
}, 
  { timestamps: true }
);

module.exports = mongoose.model('DeveloperApplications', developerApplicationSchema);
