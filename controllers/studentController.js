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


exports.deleteStudent = async (req, res) => {
  try {
    const studentToDelete = await Student.findById(req.params.id);
    if (!studentToDelete) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await studentToDelete.deleteOne();
    res.json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics: Get fees for students
exports.getStudentExpenses = async (req, res) => {
  try {
    const totalExpenses = await Student.aggregate([
      { $group: { _id: null, totalFees: { $sum: '$feesPaid' } } },
    ]);
    res.json(totalExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};