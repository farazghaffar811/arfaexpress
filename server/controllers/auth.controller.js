

const Employee = require('../models/employee.model');

// New User Registration
exports.enroll = async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;

    if (!name || !email || !password || !role || !employeeId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newEmployee = await Employee.create({
      name,
      email,
      password,
      role,
      employeeId
    });

    res.status(201).json({
      message: "Enrollment successful",
      employee: {
        _id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        role: newEmployee.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Enrollment failed", error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const employee = await Employee.findOne({ email, role });

    if (!employee || employee.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


