const axios = require('axios');
const fetchTechNews = require('../../utils/fetchTechNews'); 

// @desc Get developer dashboard
// @route GET /api/developer/dashboard
const getDeveloperDashboard = async (req, res) => {
    try {
      const techNews = await fetchTechNews(); // Fetch tech news dynamically
      res.status(200).json({ techNews });
    } catch (error) {
        console.error('Error in getDeveloperDashboard:', error.message);
        res.status(500).json({ message: 'Error loading tech news from API', error: error.message });
    }
  };
  
  
  module.exports = { getDeveloperDashboard };
  