const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
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

//Connect to MongoDB
connectDB();

//API Routes
app.get('/', (req, res) => {
    res.send('Welcome to the TalentBridge API!');
  });
// app.use('/api/developers', require('./routes/developerRoutes'));
// app.use('/api/companies', require('./routes/companyRoutes'));

//Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
