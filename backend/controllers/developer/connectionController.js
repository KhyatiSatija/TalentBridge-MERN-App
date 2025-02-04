const DeveloperConnections = require('../../models/developerConnections');
const DeveloperProfile = require('../../models/developerProfile');
const Developer = require('../../models/developer');

// @desc Get developer connections
// @route GET /api/developer/connections
const getMyConnections = async (req, res) => {
  try {
    const loggedInUserId = req.headers["developer-id"];

    // Fetch connection data for the logged-in user
    let loggedInUserConnection = await DeveloperConnections.findOne({ developerId: loggedInUserId }).lean();

    if (!loggedInUserConnection) {
      // If connection data doesn't exist, create it
      loggedInUserConnection = await DeveloperConnections.create({
        developerId: loggedInUserId,
        connections: { rejected: [], requested: [], matched: [], connectionRequests: [] },
      });
    }

    // Fetch connection requests (developers who sent requests to the user)
    const connectionRequestDevelopers = await Developer.find({
        _id: { $in: loggedInUserConnection.connections.connectionRequests },
      })
        .select('_id fullName')
        .lean();
  
      const connectionRequests = await DeveloperProfile.find({
        developerId: { $in: loggedInUserConnection.connections.connectionRequests },
      }).lean();
  
      const combinedConnectionRequests = connectionRequestDevelopers.map((developer) => {
        const profile = connectionRequests.find((p) => p.developerId.toString() === developer._id.toString());
        return {
          fullName: developer.fullName,
          ...profile
        };
      });



    // Fetch requested connections (developers the user sent requests to)
    const requestedDevelopers = await Developer.find({
        _id: { $in: loggedInUserConnection.connections.requested },
      })
        .select('_id fullName')
        .lean();
  
      const requestedProfiles = await DeveloperProfile.find({
        developerId: { $in: loggedInUserConnection.connections.requested },
      }).lean();
  
      const combinedRequested = requestedDevelopers.map((developer) => {
        const profile = requestedProfiles.find((p) => p.developerId.toString() === developer._id.toString());
        return {
          ...profile,
          fullName: developer.fullName,
        };
      });

    
    // Fetch matched developers (both profile data and contact details)
    const matchedDevelopers = await Developer.find({
        _id: { $in: loggedInUserConnection.connections.matched },
      })
        .select('_id fullName email phoneNumber')
        .lean();
  
      const matchedProfiles = await DeveloperProfile.find({
        developerId: { $in: loggedInUserConnection.connections.matched },
      }).lean();
  
      const combinedMatched = matchedDevelopers.map((developer) => {
        const profile = matchedProfiles.find((p) => p.developerId.toString() === developer._id.toString());
        return {
          ...profile,
          fullName: developer.fullName,
          email: developer.email,
          phoneNumber: developer.phoneNumber,
        };
      });


    // Combine and structure the data
    res.status(200).json({
      connectionRequests: combinedConnectionRequests,
      requested: combinedRequested,
      matched: combinedMatched,
    });
  } catch (error) {
    console.error('Error fetching connections:', error.message);
    res.status(500).json({ message: 'Error fetching connections', error: error.message });
  }
};

// @desc Update developer connections
// @route PUT /api/developer/connections
const updateConnection = async (req, res) => {
  const { targetDeveloperId, action } = req.body; // action = 'accept', 'reject', 'cancelRequest'

  try {
    const loggedInUserId = req.headers["developer-id"];

    // Fetch connection data for both developers
    let loggedInUserConnection = await DeveloperConnections.findOne({ developerId: loggedInUserId });
    let targetDeveloperConnection = await DeveloperConnections.findOne({ developerId: targetDeveloperId });

    if (!loggedInUserConnection || !targetDeveloperConnection) {
      //create it
        await DeveloperConnections.create({ developerId: loggedInUserId, connections: { rejected: [], requested: [], matched: [], connectionRequests: [] } });
        await DeveloperConnections.create({ developerId: targetDeveloperId, connections: { rejected: [], requested: [], matched: [], connectionRequests: [] } });
    }

    if (action === 'accept') {
      // Accept a connection request
      // Remove target developer ID from connectionRequests and add to matched for logged-in user
      loggedInUserConnection.connections.connectionRequests = loggedInUserConnection.connections.connectionRequests.filter(
        (id) => id.toString() !== targetDeveloperId.toString()
      );
      loggedInUserConnection.connections.matched.push(targetDeveloperId);

      // Remove logged-in user ID from requested and add to matched for target developer
      targetDeveloperConnection.connections.requested = targetDeveloperConnection.connections.requested.filter(
        (id) => id.toString() !== loggedInUserId.toString()
      );
      targetDeveloperConnection.connections.matched.push(loggedInUserId);
    }
     else if (action === 'reject') {
      // Reject a connection request
      // Remove target developer ID from connectionRequests and add to rejected for logged-in user
      loggedInUserConnection.connections.connectionRequests = loggedInUserConnection.connections.connectionRequests.filter(
        (id) => id.toString() !== targetDeveloperId.toString()
      );
      loggedInUserConnection.connections.rejected.push(targetDeveloperId);
      // Remove logged-in user ID from requested list for target developer
        targetDeveloperConnection.connections.requested = targetDeveloperConnection.connections.requested.filter(
        (id) => id.toString() !== loggedInUserId.toString()
        );
    } else if (action === 'cancelRequest') {
      // Cancel a sent request
      // Remove target developer ID from requested for logged-in user 
      loggedInUserConnection.connections.requested = loggedInUserConnection.connections.requested.filter(
        (id) => id.toString() !== targetDeveloperId.toString()
      );

      // Remove logged-in user ID from connectionRequests for target developer
      targetDeveloperConnection.connections.connectionRequests = targetDeveloperConnection.connections.connectionRequests.filter(
        (id) => id.toString() !== loggedInUserId.toString()
      );
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Save updates to both connection records
    await loggedInUserConnection.save();
    await targetDeveloperConnection.save();

    res.status(200).json({ message: 'Connection updated successfully' });
  } catch (error) {
    console.error('Error updating connection:', error.message);
    res.status(500).json({ message: 'Error updating connection', error: error.message });
  }
};

module.exports = { getMyConnections, updateConnection };
