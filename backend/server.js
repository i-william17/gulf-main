const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

// Initialize the app 
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: ["http://localhost:5000", "http://localhost:3000"],
  credentials: true
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import routes
app.use('/api/patient', patientRoutes);
app.use('/api/user', userRoutes);

// Example route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});