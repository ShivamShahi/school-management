const Class = require('../models/Class');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Add a class
exports.addClass = async (req, res) => {
  const { className, year, teacher, studentFees, maxStudents } = req.body;

  try {
    // Find the teacher by name
    const teacherObj = await Teacher.findOne({ name: teacher });

    if (!teacherObj) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const newClass = new Class({
      className,
      year,
      teacher: teacherObj._id,
      studentFees,
      maxStudents
    });

    await newClass.save();

    res.status(201).json({
      _id: newClass._id,
      className: newClass.className,
      year: newClass.year,
      teacher: teacherObj.name, 
      studentFees: newClass.studentFees,
      maxStudents: newClass.maxStudents
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher', 'name');
    const transformedClasses = await Promise.all(classes.map(async classObj => {
      const students = await Student.find({ class: classObj._id }, 'name');

      const studentNames = students.map(student => student.name);

      return {
        ...classObj.toObject(),
        teacher: classObj.teacher ? classObj.teacher.name : 'No teacher assigned',
        students: studentNames
      };
    }));

    res.json(transformedClasses);
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

// Get analytics for all classes (details and male/female student ratio)
exports.getAllClassAnalytics = async (req, res) => {
  try {
    const classes = await Class.find();
    const classAnalytics = await Promise.all(classes.map(async (classObj) => {
      const students = await Student.find({ class: classObj._id });
      const maleCount = students.filter(student => student.gender === 'Male').length;
      const femaleCount = students.filter(student => student.gender === 'Female').length;

      return {
        class: classObj.className,
        maleCount,
        femaleCount,
        totalStudents: maleCount + femaleCount
      };
    }));

    res.json(classAnalytics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classToDelete = await Class.findById(req.params.id);
    if (!classToDelete) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classToDelete.deleteOne();
    res.json({ message: 'Class removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};