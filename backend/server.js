const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// Cross Origin Resource Sharing is used for the communication between the backend and frontend
const connectDB = require('./config/database'); //Database connection

//Load environment variables
dotenv.config();

//Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('dev')); //HTTP request logger middleware for Node.js(helps to debig and monitor the server)

//Connect to MongoDB
connectDB();

//API Routes
app.get('/', (req, res) => {
    res.send('Welcome to the TalentBridge API!');
  });
app.use('/api/auth/developer', require('./routes/auth/developerAuthRoutes'));
app.use('/api/auth/company', require('./routes/auth/companyAuthRoutes'));
app.use('/api/auth/forgot-password', require('./routes/auth/forgotPasswordRoutes'));
app.use('/api/auth/reset-password', require('./routes/auth/resetPasswordRoutes'));
//Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
