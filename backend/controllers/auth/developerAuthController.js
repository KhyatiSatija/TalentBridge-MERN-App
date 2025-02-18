const Developer = require('../../models/developer');

// @desc Register a new developer
// @route POST /api/auth/developer/signup

const developerSignup = async (req, res) => {
    const { fullName, email, password, phoneNumber } = req.body;
  
    try {
      //check if email exists already in the database
      const existingDeveloperEmail = await Developer.findOne({ email : email});
      if (existingDeveloperEmail){
        return res.status(400).json({ message : "An account with this email already exists!!" });
      }
      const existingDeveloperPhoneNumber = await Developer.findOne({ phoneNumber : phoneNumber });
      if (existingDeveloperPhoneNumber){
        return res.status(400).json({ message : "An account with this phone number exists already!!"});
      }

      const developer = await Developer.create({ fullName, email, password, phoneNumber });
      res.status(201).json({ message: 'Developer registered successfully', developerId: developer._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

// @desc Login an existing developer
// @route POST /api/auth/developer/login
const developerLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const developer = await Developer.login({ email, password });
      res.status(200).json({ message: 'Login successful', developerId: developer._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

module.exports = { developerSignup, developerLogin };

