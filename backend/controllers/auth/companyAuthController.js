const Company = require('../../models/company');

// @desc Register a new company
// @route POST /api/auth/company/signup
const companySignup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const company = await Company.create({ name, email, password });
    res.status(201).json({ message: 'Company registered successfully', companyId: company._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Login a company
// @route POST /api/auth/company/login
const companyLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.login({ email, password });
    res.status(200).json({ message: 'Login successful', companyId: company._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { companySignup, companyLogin };
