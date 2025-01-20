const mongoose = require("mongoose");

const developerConnectionSchema = new mongoose.Schema(
  {
    developerId: { type: mongoose.Schema.Types.ObjectId, ref: "Developer", required: true },
    connections: {
      rejected: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" }], // Developers who were swiped left
      requested: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" }], // Developers who were swiped right
      matched: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" }],   // Developers they are matched with
      connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Developer" }], // Developers who swiped right on this developer
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DeveloperConnections", developerConnectionSchema);
