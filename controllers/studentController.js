const Student = require('../models/Student');

// Add a student
exports.addStudent = async (req, res) => {
  const { name, gender, dob, contactDetails, class: classId, feesPaid } = req.body;
  try {
    const newStudent = new Student({ name, gender, dob, contactDetails, class: classId, feesPaid });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('class');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

