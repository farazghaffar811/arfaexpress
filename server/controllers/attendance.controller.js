// const Attendance = require('../models/attendance.model');
// const { matchFingerprint } = require('../services/fingerprint.service');

// exports.markAttendance = async (req, res) => {
//   try {
//     const employee = await matchFingerprint();

//     if (!employee) {
//       return res.status(404).json({ message: 'Fingerprint not matched' });
//     }

//     const type = req.body.type || 'check-in';

//     const attendanceRecord = await Attendance.create({
//       employeeId: employee.employeeId,
//       type
//     });

//     res.status(200).json({
//       message: `Attendance marked: ${type}`,
//       employee: employee.name,
//       time: attendanceRecord.timestamp
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Attendance failed', error: err.message });
//   }
// };


const Attendance = require('../models/attendance.model');
const { matchFingerprint } = require('../services/fingerprint.service');

exports.markAttendance = async (req, res) => {
  try {
    const employee = await matchFingerprint();

    if (!employee) {
      return res.status(404).json({ message: '❌ Fingerprint not matched' });
    }

    const type = req.body.type || 'check-in';

    const attendanceRecord = await Attendance.create({
      employeeId: employee.employeeId,
      type
    });

    res.json({
      message: `Attendance marked: ${type}`,
      employee: employee.name,
      timestamp: attendanceRecord.timestamp
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Attendance failed', error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await Attendance.find()
      .sort({ timestamp: -1 })
      .populate('employeeId', 'name employeeId');

    res.json({ total: logs.length, logs });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
};


