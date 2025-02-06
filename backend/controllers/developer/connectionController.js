const DeveloperConnections = require('../../models/developerConnections');
const DeveloperProfile = require('../../models/developerProfile');
const Developer = require('../../models/developer');
const mongoose  = require('mongoose');
const { getIo } = require("../../socket"); 
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

    // Fetch connection requests (developers who sent requests to the logged in user)
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
        developerId: developer._id,
        fullName: developer.fullName,
        ...profile
      };
    });
    //if the developers do not have made a profile yet, the profile.developerId will be undefined.Hence have to explicitly pass the developerId.


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
        developerId: developer._id,
        fullName: developer.fullName,
        ...profile,
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
          developerId: developer._id,
          fullName: developer.fullName,
          email: developer.email,
          phoneNumber: developer.phoneNumber,
          ...profile,
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
  console.log(getIo);
  console.log("START");
  let { targetDeveloperId, action } = req.body; // action = 'accept', 'reject', 'cancelRequest'
  let loggedInUserId = req.headers["developer-id"];
  console.log(targetDeveloperId); 
  try {
    console.log("hii");
    
    console.log(loggedInUserId);

    // Fetch connection data for both developers
    let loggedInUserConnection = await DeveloperConnections.findOne({ developerId: loggedInUserId });
    let targetDeveloperConnection = await DeveloperConnections.findOne({ developerId: targetDeveloperId });

    console.log("Logged-in User Connection:", loggedInUserConnection);
    console.log("Target Developer Connection:", targetDeveloperConnection);


    if (!loggedInUserConnection) {
      console.log("Logged In developer connections missing so creating them");
      //create it
        console.log(loggedInUserId);

        loggedInUserId = new mongoose.Types.ObjectId(loggedInUserId);
        loggedInUserConnection = await DeveloperConnections.create({ developerId: loggedInUserId, connections: { rejected: [], requested: [], matched: [], connectionRequests: [] } });
        console.log("Created new connection records for loggedInUser");
    }

    if (!targetDeveloperConnection) {
      console.log("target developer connections missing so creating them");
      //create it
        targetDeveloperId = new mongoose.Types.ObjectId(targetDeveloperId);
        targetDeveloperConnection =  await DeveloperConnections.create({ developerId: targetDeveloperId, connections: { rejected: [], requested: [], matched: [], connectionRequests: [] } });
        console.log("Created new connection records for targetDeveloper", targetDeveloperConnection);
    }

    if (action === 'accept') {
      console.log("Processing acceptance...");
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

    // Emit WebSocket event to specific users
    const io = getIo(); // Get WebSocket instance
    io.to(targetDeveloperId.toString()).emit("connection-updated", { developerId: targetDeveloperId });
    io.to(loggedInUserId.toString()).emit("connection-updated", { developerId: loggedInUserId });
    
    res.status(200).json({ message: 'Connection updated successfully' });
  } catch (error) {
    console.error('Error updating connection:', error.message);
    res.status(500).json({ message: 'Error updating connection', error: error.message });
  }
};

module.exports = { getMyConnections, updateConnection };
