const Developer = require('../../models/developer');
const DeveloperProfile = require('../../models/developerProfile');
const DeveloperConnections = require('../../models/developerConnections');
// @desc Fetch developers excluding signed-in user, rejected, requested, and matched developers
// @route GET /api/developer/connect
const getDeveloperCards = async (req, res) => {
    try {
        const loggedInUserId = req.user.id;
    
        // Fetch IDs of developers to exclude based on connection status
        const excludedDeveloperConnections = await DeveloperConnection.find({
          $or: [
            { senderId: loggedInUserId, status: 'rejected' }, // Developers rejected by the user
            { receiverId: loggedInUserId, status: 'rejected' }, // Developers who rejected the user
            { senderId: loggedInUserId, status: 'requested' }, // Developers the user has swiped right on (requested)
            { receiverId: loggedInUserId, status: 'requested' }, // Developers who swiped right on the user
            { senderId: loggedInUserId, status: 'accepted' }, // Matched developers
            { receiverId: loggedInUserId, status: 'accepted' }, // Matched developers
          ],
        }).lean();
    
        // Extract IDs to exclude
        const excludedDeveloperIds = new Set(
          excludedDeveloperConnections.flatMap((connection) => [
            connection.senderId.toString(),
            connection.receiverId.toString(),
          ])
        );
        excludedDeveloperIds.add(loggedInUserId); // Exclude the logged-in user
    
        // Fetch profiles of developers not in the exclusion list
        const profiles = await DeveloperProfile.find({
          developerId: { $nin: Array.from(excludedDeveloperIds) },
        }).lean();
    
        // Map profiles to the required data structure
        const combinedData = profiles.map((profile) => ({
          id: profile.developerId, // Developer ID for frontend use
          profilePhoto: profile.profilePhoto || null,
          bio: profile.bio || null,
          location: profile.location || null,
          linkedIn: profile.linkedIn || null,
          github: profile.github || null,
          portfolio: profile.portfolio || null,
          professionalDetails: profile.professionalDetails || null,
          education: profile.education || null,
          workExperience: profile.workExperience || null,
          additionalInfo: {
            certifications: profile.additionalInfo?.certifications || null,
            achievements: profile.additionalInfo?.achievements || null,
            languages: profile.additionalInfo?.languages || null,
          },
        }));
    
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
      const loggedInUserId = req.user.id;
  
      // Fetch connection records for both developers
      const loggedInUserConnection = await DeveloperConnections.findOne({ developerId: loggedInUserId });
      const targetDeveloperConnection = await DeveloperConnections.findOne({ developerId });
  
      // Ensure both connection records exist
      if (!loggedInUserConnection || !targetDeveloperConnection) {
        return res.status(404).json({ message: 'Connection records not found for one or both developers' });
      }
  
      if (action === 'swipeRight') {
        // Check if the target developer has already sent a connection request to the logged-in user
        if (targetDeveloperConnection.connections.connectionRequests.includes(loggedInUserId)) {
          // Case 1: Match is made
          // Update logged-in user
          loggedInUserConnection.connections.connectionRequests =
            loggedInUserConnection.connections.connectionRequests.filter((id) => id.toString() !== developerId.toString());
          loggedInUserConnection.connections.matched.push(developerId);
  
          // Update target developer
          targetDeveloperConnection.connections.requested =
            targetDeveloperConnection.connections.requested.filter((id) => id.toString() !== loggedInUserId.toString());
          targetDeveloperConnection.connections.matched.push(loggedInUserId);
        } else {
          // Case 2: Add to requested list for the logged-in user
          if (!loggedInUserConnection.connections.requested.includes(developerId)) {
            loggedInUserConnection.connections.requested.push(developerId);
          }
        }
      } else if (action === 'swipeLeft') {
        // Case 3: Swipe left
        if (targetDeveloperConnection.connections.connectionRequests.includes(loggedInUserId)) {
          // Remove from requested and connectionRequests
          targetDeveloperConnection.connections.requested =
            targetDeveloperConnection.connections.requested.filter((id) => id.toString() !== loggedInUserId.toString());
          loggedInUserConnection.connections.connectionRequests =
            loggedInUserConnection.connections.connectionRequests.filter((id) => id.toString() !== developerId.toString());
        }
        // Add to rejected list for logged-in user
        if (!loggedInUserConnection.connections.rejected.includes(developerId)) {
          loggedInUserConnection.connections.rejected.push(developerId);
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
