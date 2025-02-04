const Developer = require('../../models/developer');
const DeveloperProfile = require('../../models/developerProfile');
const DeveloperConnections = require('../../models/developerConnections');

// @desc Fetch developers excluding signed-in user, rejected, requested, and matched developers
// @route GET /api/developer/connect
const getDeveloperCards = async (req, res) => {
    try {
        // const loggedInUserId = req.user.id;
        const loggedInUserId = req.headers["developer-id"];
        console.log('Logged in user ID:', loggedInUserId);

        // Fetch the connection data for the logged-in user
        let loggedInUserConnection = await DeveloperConnections.findOne({ developerId: loggedInUserId }).lean();

        // If connection data doesn't exist, initialize it
        if (!loggedInUserConnection) {
          console.log('No connection data found for the logged-in user. Initializing...');
          loggedInUserConnection = {
            connections: {
              rejected: [],
              requested: [],
              matched: [],
              connectionRequests: [],
            },
          };
          // Optionally, create a new DeveloperConnections document
          await DeveloperConnections.create({
            developerId: loggedInUserId,
            connections: {
              rejected: [],
              requested: [],
              matched: [],
              connectionRequests: [],
            },
          });
        }


        // Fetch developers who have rejected the logged-in user
        const developersWhoRejectedUser = await DeveloperConnections.find({
          "connections.rejected": loggedInUserId,
        })
          .select("developerId")
          .lean();

        // Extract the IDs of developers who have rejected the logged-in user
        const developersWhoRejectedUserIds = developersWhoRejectedUser.map(
          (connection) => connection.developerId.toString()
        );
      
      // Create a set of excluded developer IDs based on connections
      const excludedDeveloperIds = new Set([
        loggedInUserId, // Exclude the logged-in user
        ...loggedInUserConnection.connections.rejected, // Developers rejected by the user
        ...loggedInUserConnection.connections.requested, // Developers the user has swiped right on
        ...loggedInUserConnection.connections.matched, // Matched developers
        ...developersWhoRejectedUserIds, // Developers who rejected the logged-in user
      ]);


      // Fetch developers who are not excluded
      const developers = await Developer.find({ _id: { $nin: Array.from(excludedDeveloperIds) } })
        .select('_id fullName') // Fetch only the ID and full name
        .lean();


      // Fetch profiles for the developers
      const developerIds = developers.map((developer) => developer._id);
      const profiles = await DeveloperProfile.find({ developerId: { $in: developerIds } }).lean();

      // Combine developer and profile data
      const combinedData = developers.map((developer) => {
        const profile = profiles.find((p) => p.developerId.toString() === developer._id.toString());
        return {
          id: developer._id, // Developer ID
          fullName: developer.fullName, 
          profilePhoto: profile?.profilePhoto || null, 
          bio: profile?.bio || null,
          location: profile?.location || null,
          linkedIn: profile?.linkedIn || null,
          github: profile?.github || null,
          portfolio: profile?.portfolio || null,
          professionalDetails: profile?.professionalDetails || null,
          education: profile?.education || null,
          workExperience: profile?.workExperience || null,
          additionalInfo: {
            certifications: profile?.additionalInfo?.certifications || null,
            achievements: profile?.additionalInfo?.achievements || null,
            languages: profile?.additionalInfo?.languages || null,
          },
        };
      });
      res.status(200).json(combinedData);

      } catch (error) {
        console.error('Error fetching developer cards:', error.message);
        res.status(500).json({ message: 'Error fetching developers', error: error.message });
      }
    };
    
// @desc Record swipe action
// @route POST /api/developer/connect
const updateConnection = async (req, res) => {
    const { developerId, action } = req.body; // `developerId` is the target developer's ID, `action` is 'swipeRight' or 'swipeLeft'
  
    try {
      // const loggedInUserId = req.user.id;
      const loggedInUserId = req.headers["developer-id"];
      // Fetch connection records for both developers
      let loggedInUserConnection = await DeveloperConnections.findOne({ developerId: loggedInUserId });
      let targetDeveloperConnection = await DeveloperConnections.findOne({ developerId });
  
      // Ensure connection records exist, or create them if they don't
      if (!loggedInUserConnection) {
        loggedInUserConnection = await DeveloperConnections.create({
          developerId: loggedInUserId,
          connections: {
            rejected: [],
            requested: [],
            matched: [],
            connectionRequests: [],
          },
        });
      }

      if (!targetDeveloperConnection) {
        targetDeveloperConnection = await DeveloperConnections.create({
          developerId,
          connections: {
            rejected: [],
            requested: [],
            matched: [],
            connectionRequests: [],
          },
        });
      }
  
      if (action === 'swipeRight') {
        // Check if the target developer has already sent a connection request
        if (loggedInUserConnection.connections.connectionRequests.includes(developerId)) {
          // Case 1: Match is made
          // Update logged-in user
          loggedInUserConnection.connections.connectionRequests = loggedInUserConnection.connections.connectionRequests.filter(
            (id) => id.toString() !== developerId.toString()
          );
          loggedInUserConnection.connections.matched.push(developerId);
  
          // Update target developer
          targetDeveloperConnection.connections.requested = targetDeveloperConnection.connections.requested.filter(
            (id) => id.toString() !== loggedInUserId.toString()
          );
          targetDeveloperConnection.connections.matched.push(loggedInUserId);
        } else {
          // Case 2: Add to requested list for the logged-in user
          if (!loggedInUserConnection.connections.requested.includes(developerId)) {
            loggedInUserConnection.connections.requested.push(developerId);
          }
  
          // Add the logged-in user to the connectionRequests list for the target developer
          if (!targetDeveloperConnection.connections.connectionRequests.includes(loggedInUserId)) {
            targetDeveloperConnection.connections.connectionRequests.push(loggedInUserId);
          }
        }
      } else if (action === 'swipeLeft') {
        // Check if the target developer has already sent a connection request
        if (loggedInUserConnection.connections.connectionRequests.includes(developerId)) {
          // Case 3: Rejected after a connection request
          loggedInUserConnection.connections.connectionRequests = loggedInUserConnection.connections.connectionRequests.filter(
            (id) => id.toString() !== developerId.toString()
          );
          loggedInUserConnection.connections.rejected.push(developerId);
  
          // Remove logged-in user from the target developer's requested list
          targetDeveloperConnection.connections.requested = targetDeveloperConnection.connections.requested.filter(
            (id) => id.toString() !== loggedInUserId.toString()
          );
        } else {
          // Case 4: Regular rejection
          if (!loggedInUserConnection.connections.rejected.includes(developerId)) {
            loggedInUserConnection.connections.rejected.push(developerId);
          }
        }
      }
  
  
      // Save changes to both developers
      await loggedInUserConnection.save();
      await targetDeveloperConnection.save();
  
      res.status(200).json({ message: 'Action recorded successfully' });
    } catch (error) {
      console.error('Error updating connection:', error.message);
      res.status(500).json({ message: 'Error recording action', error: error.message });
    }
  };
  

module.exports = { getDeveloperCards, updateConnection };
