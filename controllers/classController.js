const Class = require('../models/Class');
const Student = require('../models/Student');

// Add a class
exports.addClass = async (req, res) => {
  const { className, year, teacher, studentFees, maxStudents } = req.body;
  try {
    const newClass = new Class({ className, year, teacher, studentFees, maxStudents });
    await newClass.save();
    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher').populate('students');
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get class analytics (e.g., class details, number of male and female students)
exports.getClassAnalytics = async (req, res) => {
  try {
    const classId = req.params.id;
    const classDetails = await Class.findById(classId).populate('teacher').populate('students');
    
    const maleCount = await Student.countDocuments({ class: classId, gender: 'male' });
    const femaleCount = await Student.countDocuments({ class: classId, gender: 'female' });

    res.json({ classDetails, maleCount, femaleCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

