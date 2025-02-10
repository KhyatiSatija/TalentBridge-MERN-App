const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
// Cross Origin Resource Sharing is used for the communication between the backend and frontend
const connectDB = require('./config/database'); //Database connection
const { initializeSocket } = require("./socket"); 
const path = require("path");

//Load environment variables
dotenv.config();

//Connect to MongoDB
connectDB();

//Initialize app
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')); //HTTP request logger middleware for Node.js(helps to debug and monitor the server)

initializeSocket(server);

//API Routes
app.get('/', (req, res) => {
    res.send('Welcome to the TalentBridge Backend!');
  });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Auth routes
app.use('/api/auth/developer', require('./routes/auth/developerAuthRoutes'));
app.use('/api/auth/company', require('./routes/auth/companyAuthRoutes'));
app.use('/api/auth/forgot-password', require('./routes/auth/forgotPasswordRoutes'));
app.use('/api/auth/reset-password', require('./routes/auth/resetPasswordRoutes'));

//Developer routes
app.use('/api/developer/dashboard', require('./routes/developer/dashboardRoutes'));
app.use('/api/developer/connect', require('./routes/developer/connectRoutes'));
app.use('/api/developer/jobs', require('./routes/developer/jobRoutes'));
app.use('/api/developer/connections', require('./routes/developer/connectionRoutes'));
app.use('/api/developer/applications', require('./routes/developer/applicationRoutes'));
app.use('/api/developer', require('./routes/developer/profileRoutes'));
app.use('/api/developer/settings', require('./routes/developer/settingsRoutes'));

//routes for company 
app.use('/api/company/jobs', require('./routes/company/jobRoutes'));
app.use('/api/company/applications', require('./routes/company/applicationRoutes'));
app.use('/api/company/settings', require('./routes/company/settingsRoutes'));

// Start Server(for both Express and WebSockets)
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
