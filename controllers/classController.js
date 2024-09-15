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
    // Fetch all classes along with the teacher and students information
    const classes = await Class.find().populate('teacher').populate('students');

    // For each class, get the male and female student counts
    const classAnalytics = await Promise.all(classes.map(async (classObj) => {
      const maleCount = await Student.countDocuments({ class: classObj._id, gender: 'male' });
      const femaleCount = await Student.countDocuments({ class: classObj._id, gender: 'female' });

      return {
        class: classObj.className,
        maleCount,
        femaleCount,
        totalStudents: maleCount + femaleCount,
      };
    }));

    // Send the response with analytics for all classes
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