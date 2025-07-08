// // Simulate same template for both enrollment and match
// exports.scanFingerprint = async () => {
//   return Buffer.from('fixed-template'); 
// };

// exports.matchFingerprint = async () => {
//   const scannedTemplate = Buffer.from('fixed-template'); 

//   const Employee = require('../models/employee.model');
//   const employees = await Employee.find();

//   for (let emp of employees) {
//     if (emp.fingerprintTemplate.toString() === scannedTemplate.toString()) {
//       return emp; 
//     }
//   }

//   return null; 
// };

// 2nd code

// const { exec } = require('child_process');
// const fs = require('fs');
// const path = require('path');

// exports.scanFingerprint = async () => {
//   return new Promise((resolve, reject) => {
//     exec('C:\\HID\\scanner\\capture.exe', (err, stdout, stderr) => {
//       if (err) {
//         console.error('🛑 Scanner error:', err.message);
//         return reject(new Error('📛 Fingerprint scanner not available.'));
//       }

//       const template = stdout.trim();
//       if (!template || template.length < 10) {
//         return reject(new Error('🛑 No fingerprint detected'));
//       }

//       resolve(Buffer.from(template));
//     });
//   });
// };

// 3rd code

const Employee = require('../models/employee.model');

// Simulated SDK fingerprint match
exports.matchFingerprint = async () => {
  const scannedTemplate = "template123"; // ← replace with SDK reading
  const allEmployees = await Employee.find();

  for (const emp of allEmployees) {
    if (emp.fingerprintTemplate === scannedTemplate) {
      return emp;
    }
  }

  return null;
};
