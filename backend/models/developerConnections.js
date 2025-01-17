const mongoose = require('mongoose');

const developerConnectionSchema = new mongoose.Schema({
  developerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer', required: true },
  connectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Developer', required: true },
  status: { type: String, enum: ['sent', 'accepted', 'rejected'], default: 'sent' }
}, { timestamps: true });

module.exports = mongoose.model('DeveloperConnections', developerConnectionSchema);
