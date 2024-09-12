const Teacher = require('../models/Teacher');

// Add a teacher
exports.addTeacher = async (req, res) => {
  const { name, gender, dob, contactDetails, salary, assignedClasses } = req.body;
  try {
    const newTeacher = new Teacher({ name, gender, dob, contactDetails, salary, assignedClasses });
    await newTeacher.save();
    res.status(201).json(newTeacher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('assignedClasses');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Analytics: Get expenses for teachers
exports.getTeacherExpenses = async (req, res) => {
  try {
    const totalExpenses = await Teacher.aggregate([
      { $group: { _id: null, totalSalary: { $sum: '$salary' } } },
    ]);
    res.json(totalExpenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

