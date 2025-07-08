const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const deviceRoutes = require('./routes/device.routes');

const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Middleware to parse JSON & URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logging and CORS
app.use(cors());
app.use(morgan('dev'));

// 4. Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);  
app.use('/api/device', deviceRoutes);

module.exports = app;
