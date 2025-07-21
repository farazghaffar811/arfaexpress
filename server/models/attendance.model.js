// const mongoose = require('mongoose');

// const attendanceSchema = new mongoose.Schema({
//   employeeId: { type: String, required: true },
//   type: { type: String, enum: ['check-in', 'check-out'], required: true },
//   timestamp: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Attendance', attendanceSchema);

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  type: {
    type: String,
    enum: ['check-in', 'check-out'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Attendance', attendanceSchema);
